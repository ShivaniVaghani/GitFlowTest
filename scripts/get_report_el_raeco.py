# Due to DATA availability issue in DEV this is running now on workflow id different. Actual 270
#!/usr/bin/env python3


import argparse
import os
import sys
import base64
from datetime import datetime, timedelta
from io import BytesIO
from openpyxl.utils.dataframe import dataframe_to_rows
import pandas as pd
from .utils import connect_db, el_raeco_metadata

# --- Locate script & output directories ---
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(script_dir)
output_dir = os.path.join(project_root, 'output')
os.makedirs(output_dir, exist_ok=True)

# --- Defaults for query window: yesterday 07:00:01 → today 07:00:00 ---
yesterday = datetime.now().date() - timedelta(days=1)
default_start = datetime.combine(yesterday, datetime.min.time()).strftime("%Y-%m-%d, 07:00:01")
default_end   = datetime.now().strftime("%Y-%m-%d, 07:00:00")


def get_workflow_metadata_el_raeco(req_start_date: str, req_end_date: str) -> str:
    with connect_db() as conn:
        cursor = conn.cursor()
        query = """
        SELECT DISTINCT
            t.task_id,
            t.account_no,
            t.task_data_json,
            t.task_details_json,
            t.pdf_link,
            u.email,
            t.finished_date
        FROM task_completion_info t
        JOIN app_user u ON t.user_id = u.user_id
        WHERE t.workflow_id = 219
          AND t.record_created_at BETWEEN %s AND %s
        ORDER BY t.finished_date DESC;
        """
        cursor.execute(query, (req_start_date, req_end_date))
        rows = cursor.fetchall()
        print(f"number of results {len(rows)}", file=sys.stderr, flush=True)
        return new_data_to_excel(rows)


def update_keys(data: dict, task_details: dict, pdf_link, user_name) -> dict:
    task_data = {el_raeco_metadata.get(k, k): v for k, v in data.items()}
    task_details_map = {
        "PDF Link":     pdf_link,
        "User Name":    user_name,
        "Meter No":     task_details.get("Meter No", ""),
        "Reader Code":  task_details.get("Area Code", ""),
        "Consumer Type":task_details.get("Consumer Type", ""),
    }
    return task_data | task_details_map


def format_hyperlink(url: str) -> str:
    if not pd.isna(url) and url:
        return f'=HYPERLINK("{url}")'
    return ""


def new_data_to_excel(task_data: list[tuple]) -> str:
    # Transform raw rows into dicts
    updated = [
        update_keys(t[2], t[3], t[4], t[5])
        for t in task_data
    ]
    df = pd.DataFrame(updated)

    # If the PDF Link column exists, turn it into a hyperlink
    if 'PDF Link' in df.columns:
        df['PDF Link'] = df['PDF Link'].apply(format_hyperlink)

    # Standardize finishedDate
    if 'finishedDate' in df.columns:
        df['finishedDate'] = pd.to_datetime(df['finishedDate']) \
            .dt.strftime("%Y-%m-%d %H:%M:%S")

    # Build the final DataFrame
    if df.empty:
        new_df = pd.DataFrame({
            "SL_NO":        [""],
            "ACC_NO":       [""],
            "METER_NO":     [""],
            "READING_DATE": [""],
            "METER_READING":[""],
            "BTYP":         [""],
            "READER_CODE":  [""],
            "CONS_TYPE":    [""],
            "LATI_Y":       [""],
            "LONG_X":       [""],
            "IMAGE_NAME":   [""],
            "Field Users":  [""],
        })
    else:
        new_df = pd.DataFrame({
            "SL_NO":         range(1, len(df)+1),
            "ACC_NO":        df.get("Account No", ""),
            "METER_NO":      df.get("Meter No", ""),
            "READING_DATE":  pd.to_datetime(df.get("finishedDate", "")),
            "METER_READING": df.get("Meter Reading", ""),
            "BTYP":          df.get("Read Type", ""),
            "READER_CODE":   df.get("Reader Code", ""),
            "CONS_TYPE":     df.get("Consumer Type", ""),
            "LATI_Y":        df.get("latitude", ""),
            "LONG_X":        df.get("longitude", ""),
            "IMAGE_NAME":    df.get("PDF Link", ""),
            "Field Users":   df.get("User Name", ""),
        })

    # Create views
    unique_df      = new_df.drop_duplicates(subset=["ACC_NO"], keep="first")
    duplicate_df   = new_df[new_df.duplicated(subset=["ACC_NO"], keep="first")]
    non_regular_df = unique_df[unique_df["BTYP"] != "Regular"]
    door_locked_df = unique_df[unique_df["BTYP"] == "Door Locked"]

    # Write to Excel
    stream = BytesIO()
    with pd.ExcelWriter(stream, engine="xlsxwriter") as writer:
        for sheet_name, df_sheet in [
            ("DPC_MMR_REPORT_E", unique_df),
            ("Only Irregular",   non_regular_df),
            ("Duplicates",       duplicate_df),
            ("Door Locked_Faulty", door_locked_df)
        ]:
            df_sheet.to_excel(writer, sheet_name=sheet_name, index=False)
            ws = writer.sheets[sheet_name]
            end_col = chr(64 + len(df_sheet.columns))
            end_row = len(df_sheet) + 1
            ws.add_table(f"A1:{end_col}{end_row}", {
                "columns": [{"header": c} for c in df_sheet.columns],
                "style":   "Table Style Medium 16",
                "banded_columns": True
            })
            for i, col in enumerate(df_sheet.columns):
                width = max(df_sheet[col].astype(str).map(len).max(), len(col)) + 2
                ws.set_column(i, i, width)

    stream.seek(0)
    return base64.b64encode(stream.read()).decode("utf-8")


def main():
    parser = argparse.ArgumentParser(
        description="Generate EL RAECO MMR report"
    )
    parser.add_argument(
        "--startDate", default=default_start,
        help="Query start (YYYY-MM-DD, HH:MM:SS)"
    )
    parser.add_argument(
        "--endDate", default=default_end,
        help="Query end   (YYYY-MM-DD, HH:MM:SS)"
    )

    args = parser.parse_args()

    b64 = get_workflow_metadata_el_raeco(args.startDate, args.endDate)

    data  = base64.b64decode(b64)
    ts    = datetime.now().strftime("%Y%m%d_%H%M%S")
    fname = f"el_raeco_{ts}.xlsx"
    fpath = os.path.join(output_dir, fname)
    with open(fpath, "wb") as f:
        f.write(data)

    print(fpath)

if __name__ == "__main__":
    main()
# ```
#
# **Changes to fix the Photo KeyError:**
# - Removed direct `df['Photo']` usage since there is no "Photo" column in this script.
# - Hyperlinked the "PDF Link" column instead (now used as `IMAGE_NAME`).
# - Used `.get(...)` with default empty strings when building `new_df`, so missing columns won’t blow up.
#
# This will run without KeyErrors and write the output file into your project’s parallel `output/` folder.  Remember to install any missing dependencies (`openpyxl`, `xlsxwriter`, `pandas`, etc.) in your Python environment.  }}]}
