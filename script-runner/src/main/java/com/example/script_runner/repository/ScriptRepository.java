package com.example.script_runner.repository;

import com.example.script_runner.model.entity.ScriptEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ScriptRepository extends JpaRepository<ScriptEntity, Long> {
    Optional<ScriptEntity> findByNameAndActiveTrue(String name);
    List<ScriptEntity> findAllByActiveTrue();

    String abc = "# Due to DATA availability issue in DEV WHERE t.workflow_id = 219 AND ts.is_deleted = TRUE -> this updated as true\n" +
            "\n" +
            "#!/usr/bin/env python3\n" +
            "import argparse\n" +
            "import os\n" +
            "import sys\n" +
            "import base64\n" +
            "from datetime import datetime, timedelta\n" +
            "from io import BytesIO\n" +
            "from openpyxl import Workbook\n" +
            "from openpyxl.utils.dataframe import dataframe_to_rows\n" +
            "from openpyxl.styles import Alignment, PatternFill, Font, Border, Side\n" +
            "from openpyxl.worksheet.table import Table, TableStyleInfo\n" +
            "import pandas as pd\n" +
            "from .utils import (\n" +
            "    connect_db,\n" +
            "    metadata_el_nd,\n" +
            "    metadata_el_bd,\n" +
            "    metadata_el_bd_raeco,\n" +
            "    metadata_bd_water,\n" +
            ")\n" +
            "\n" +
            "# --- Default date range (previous month window) ---\n" +
            "currect_dir = os.path.dirname(os.path.abspath(__file__))\n" +
            "# Parent directory of the scripts folder\n" +
            "parent_dir = os.path.dirname(currect_dir)\n" +
            "# Default range: first day of previous month to yesterday 23:59:59\n" +
            "yesterday = datetime.now() - timedelta(days=1)\n" +
            "first_day_current_month = yesterday.replace(day=1)\n" +
            "last_day_previous_month = first_day_current_month - timedelta(days=1)\n" +
            "start_prev_month = last_day_previous_month.replace(day=1).strftime(\"%Y-%m-%d\")\n" +
            "end_date_default = yesterday.strftime(\"%Y-%m-%d, 23:59:59\")\n" +
            "\n" +
            "# --- Ensure output directory exists (parallel to scripts folder) ---\n" +
            "output_dir = os.path.join(parent_dir, 'output')\n" +
            "os.makedirs(output_dir, exist_ok=True)\n" +
            "\n" +
            "# --- Data extraction & transformation functions ---\n" +
            "def get_workflow_metadata_nd_salalah(req_start_date: str = start_prev_month,\n" +
            "                                     req_end_date: str = end_date_default) -> str:\n" +
            "    with connect_db() as conn:\n" +
            "        cursor = conn.cursor()\n" +
            "        query = \"\"\"\n" +
            "        SELECT DISTINCT\n" +
            "            t.task_id,\n" +
            "            t.account_no,\n" +
            "            t.task_data_json,\n" +
            "            t.task_details_json,\n" +
            "            t.pdf_link,\n" +
            "            u.name,\n" +
            "            t.finished_date,\n" +
            "            u.email,\n" +
            "            ad.account_details_json,\n" +
            "            t.workflow_id,\n" +
            "            ts.is_success,\n" +
            "            ts.outstanding_from_api\n" +
            "        FROM task_completion_info t\n" +
            "        JOIN app_user u ON t.user_id = u.user_id\n" +
            "        JOIN task ts ON t.task_id = ts.task_id\n" +
            "        JOIN account_details ad ON t.account_no = (ad.account_details_json->>'Account No.')::TEXT\n" +
            "        WHERE t.workflow_id = 219 AND ts.is_deleted = TRUE\n" +
            "          AND t.finished_date BETWEEN %s AND %s\n" +
            "        ORDER BY t.finished_date DESC;\"\"\"\n" +
            "        cursor.execute(query, (req_start_date, req_end_date))\n" +
            "        results = cursor.fetchall()\n" +
            "        return new_data_to_excel(results)\n" +
            "\n" +
            "\n" +
            "def get_workflow_metadata_bill_salalah(req_start_date: str = start_prev_month,\n" +
            "                                       req_end_date: str = end_date_default) -> str:\n" +
            "    workflow_ids = [216, 217, 271]\n" +
            "    with connect_db() as conn:\n" +
            "        cursor = conn.cursor()\n" +
            "        query = \"\"\"\n" +
            "        SELECT DISTINCT\n" +
            "            t.task_id,\n" +
            "            t.account_no,\n" +
            "            t.task_data_json,\n" +
            "            t.task_details_json,\n" +
            "            u.name,\n" +
            "            t.finished_date,\n" +
            "            u.email,\n" +
            "            t.workflow_id\n" +
            "        FROM task_completion_info t\n" +
            "        JOIN app_user u ON t.user_id = u.user_id\n" +
            "        JOIN task ts ON t.task_id = ts.task_id\n" +
            "        WHERE t.workflow_id = ANY(%s)\n" +
            "          AND t.finished_date BETWEEN %s AND %s\n" +
            "        ORDER BY t.finished_date DESC;\"\"\"\n" +
            "        cursor.execute(query, (workflow_ids, req_start_date, req_end_date))\n" +
            "        results = cursor.fetchall()\n" +
            "        return bill_data_to_excel(results)\n" +
            "\n" +
            "# --- Key renaming & DataFrame builders ---\n" +
            "def update_keys_nd(data: dict, task_details: dict, pdf_link, user_name,\n" +
            "                   master_data, workflowId, successfull, outstanding_from_api) -> dict:\n" +
            "    task_data = {metadata_el_nd.get(k, k): v for k, v in data.items()}\n" +
            "    task_details_map = {\n" +
            "        \"User Name\": user_name,\n" +
            "        \"Activity\": workflowId,\n" +
            "        \"Successfull\": successfull,\n" +
            "        \"Remarks\": task_details.get(\"Remarks\", \"\"),\n" +
            "        \"Phone\": master_data.get(\"PHONE\", \" \"),\n" +
            "        \"Customer Name\": master_data.get(\"CONSUMER_NAME_ENG\", \" \"),\n" +
            "        \"Geo Code\": task_details.get(\"Area Code\", \" \"),\n" +
            "        \"Updated Outstanding\": outstanding_from_api,\n" +
            "        \"Consumer Type\": task_details.get(\"Consumer Type\", \"\"),\n" +
            "    }\n" +
            "    return task_data | task_details_map\n" +
            "\n" +
            "\n" +
            "def update_keys_bd(data: dict, task_details: dict, user_name) -> dict:\n" +
            "    task_data = {metadata_el_bd.get(k, k): v for k, v in data.items()}\n" +
            "    task_details_map = {\n" +
            "        \"User Name\": user_name,\n" +
            "        \"Geo Code\": task_details.get(\"Area Code\", \" \"),\n" +
            "    }\n" +
            "    return task_data | task_details_map\n" +
            "\n" +
            "\n" +
            "def update_keys_water_bd(data: dict, task_details: dict, user_name) -> dict:\n" +
            "    task_data = {metadata_bd_water.get(k, k): v for k, v in data.items()}\n" +
            "    task_details_map = {\n" +
            "        \"User Name\": user_name,\n" +
            "        \"Geo Code\": task_details.get(\"Area Code\", \" \"),\n" +
            "    }\n" +
            "    return task_data | task_details_map\n" +
            "\n" +
            "\n" +
            "def update_keys_raeco_bd(data: dict, task_details: dict, user_name) -> dict:\n" +
            "    task_data = {metadata_el_bd_raeco.get(k, k): v for k, v in data.items()}\n" +
            "    task_details_map = {\n" +
            "        \"User Name\": user_name,\n" +
            "        \"Geo Code\": task_details.get(\"Area Code\", \" \"),\n" +
            "    }\n" +
            "    return task_data | task_details_map\n" +
            "\n" +
            "\n" +
            "def format_hyperlink(url: str) -> str:\n" +
            "    if not pd.isna(url) and url:\n" +
            "        return f'=HYPERLINK(\"{url}\")'\n" +
            "    return \"\"\n" +
            "\n" +
            "\n" +
            "def get_unique_nd(df_nd: pd.DataFrame):\n" +
            "    if df_nd.empty:\n" +
            "        return pd.DataFrame({\n" +
            "            \"Account Number\": [\"\"],\n" +
            "            \"Geocode\": [\"\"],\n" +
            "            \"Activity Intended\": [\"\"],\n" +
            "            \"Activity Date/Time\": [\"\"],\n" +
            "            \"Customer Name\": [\"\"],\n" +
            "            \"Phone\": [\"\"],\n" +
            "            \"Location\": [\"\"],\n" +
            "            \"Photo\": [\"\"],\n" +
            "            \"Field User\": [\"\"],\n" +
            "        })\n" +
            "    new_df = pd.DataFrame({\n" +
            "        \"Account Number\": df_nd.get(\"accountNo\", \"\"),\n" +
            "        \"Geocode\": df_nd.get(\"Geo Code\", \"\"),\n" +
            "        \"Activity Intended\": \"NoticeDelivery\",\n" +
            "        \"Activity Date/Time\": pd.to_datetime(\n" +
            "            df_nd[\"finishedDate\"], dayfirst=False, yearfirst=True\n" +
            "        ).dt.strftime(\"%Y-%m-%d %H:%M:%S\"),\n" +
            "        \"Customer Name\": df_nd.get(\"Customer Name\", \"\"),\n" +
            "        \"Phone\": df_nd.get(\"Phone\", \"\"),\n" +
            "        \"Location\": df_nd.get(\"Location\", \"\"),\n" +
            "        \"Photo\": df_nd.get(\"Photo\", \"\"),\n" +
            "        \"Field User\": df_nd.get(\"User Name\", \"\"),\n" +
            "    })\n" +
            "    new_df[\"Photo\"] = new_df[\"Photo\"].apply(format_hyperlink)\n" +
            "    return new_df\n" +
            "\n" +
            "\n" +
            "def get_unique_bd(df_bd: pd.DataFrame):\n" +
            "    if df_bd.empty:\n" +
            "        return pd.DataFrame({\n" +
            "            \"Account Number\": [\"\"],\n" +
            "            \"Field User\": [\"\"],\n" +
            "            \"Activity Date\": [\"\"],\n" +
            "            \"Activity Time\": [\"\"],\n" +
            "            \"GPS Location\": [\"\"],\n" +
            "        })\n" +
            "    new_df = pd.DataFrame({\n" +
            "        \"Account Number\": df_bd.get(\"accountNo\", \"\"),\n" +
            "        \"Field User\": df_bd.get(\"User Name\", \"\"),\n" +
            "        \"Activity Date\": pd.to_datetime(\n" +
            "            df_bd[\"finishedDate\"], dayfirst=False, yearfirst=True\n" +
            "        ).dt.strftime(\"%Y-%m-%d\"),\n" +
            "        \"Activity Time\": pd.to_datetime(\n" +
            "            df_bd[\"finishedDate\"], dayfirst=False, yearfirst=True\n" +
            "        ).dt.strftime(\"%H:%M:%S\"),\n" +
            "        \"GPS Location\": df_bd.get(\"GPS Location\", \"\"),\n" +
            "    })\n" +
            "    return new_df\n" +
            "\n" +
            "\n" +
            "def new_data_to_excel(task_data: list[tuple]):\n" +
            "    updated = [\n" +
            "        update_keys_nd(t[2], t[3], t[4], t[5], t[8], t[9], t[10], t[11])\n" +
            "        for t in task_data\n" +
            "    ]\n" +
            "    df = pd.DataFrame(updated)\n" +
            "    uniq = get_unique_nd(df)\n" +
            "    stream = BytesIO()\n" +
            "    with pd.ExcelWriter(stream, engine=\"xlsxwriter\") as writer:\n" +
            "        uniq.to_excel(writer, index=False, sheet_name=\"ND Report\")\n" +
            "        ws = writer.sheets[\"ND Report\"]\n" +
            "        table_range = f\"A1:{chr(64+len(uniq.columns))}{len(uniq)+1}\"\n" +
            "        ws.add_table(table_range, {\n" +
            "            \"columns\": [{\"header\": c} for c in uniq.columns],\n" +
            "            \"style\": \"Table Style Medium 16\",\n" +
            "            \"banded_columns\": True\n" +
            "        })\n" +
            "        for i, col in enumerate(uniq.columns):\n" +
            "            width = max(uniq[col].astype(str).map(len).max(), len(col)) + 2\n" +
            "            ws.set_column(i, i, width)\n" +
            "    stream.seek(0)\n" +
            "    return base64.b64encode(stream.read()).decode(\"utf-8\")\n" +
            "\n" +
            "\n" +
            "def bill_data_to_excel(task_data: list[tuple]):\n" +
            "    bd = [update_keys_bd(t[2], t[3], t[4]) for t in task_data if t[7]==216]\n" +
            "    w  = [update_keys_water_bd(t[2], t[3], t[4]) for t in task_data if t[7]==217]\n" +
            "    r  = [update_keys_raeco_bd(t[2], t[3], t[4]) for t in task_data if t[7]==271]\n" +
            "    dfs = [pd.DataFrame(df) for df in (bd, w, r)]\n" +
            "    names = [\"Elec BD Report\",\"Water BD Report\",\"RAECO Elec BD Report\"]\n" +
            "    stream = BytesIO()\n" +
            "    with pd.ExcelWriter(stream, engine=\"xlsxwriter\") as writer:\n" +
            "        for name, df in zip(names, dfs):\n" +
            "            uniq = get_unique_bd(df)\n" +
            "            uniq.to_excel(writer, index=False, sheet_name=name)\n" +
            "            ws = writer.sheets[name]\n" +
            "            tbl = f\"A1:{chr(64+len(uniq.columns))}{len(uniq)+1}\"\n" +
            "            ws.add_table(tbl, {\n" +
            "                \"columns\":[{\"header\":c} for c in uniq.columns],\n" +
            "                \"style\":\"Table Style Medium 16\",\n" +
            "                \"banded_columns\":True\n" +
            "            })\n" +
            "            for i, col in enumerate(uniq.columns):\n" +
            "                wdh = max(uniq[col].astype(str).map(len).max(), len(col)) + 2\n" +
            "                ws.set_column(i, i, wdh)\n" +
            "    stream.seek(0)\n" +
            "    return base64.b64encode(stream.read()).decode(\"utf-8\")\n" +
            "\n" +
            "# --- CLI entrypoint ---\n" +
            "def main():\n" +
            "    parser = argparse.ArgumentParser(\n" +
            "        description=\"Generate ND or Bill Excel report and save to output folder\"\n" +
            "    )\n" +
            "    parser.add_argument(\n" +
            "        \"--type\", choices=[\"nd\", \"bill\"], required=True,\n" +
            "        help=\"'nd' for Notice Delivery, 'bill' for Bill Delivery\"\n" +
            "    )\n" +
            "    parser.add_argument(\n" +
            "        \"--startDate\", default=start_prev_month,\n" +
            "        help=\"Start date (YYYY-MM-DD)\"\n" +
            "    )\n" +
            "    parser.add_argument(\n" +
            "        \"--endDate\", default=end_date_default,\n" +
            "        help=\"End date (YYYY-MM-DD, HH:MM:SS)\"\n" +
            "    )\n" +
            "\n" +
            "    args = parser.parse_args()\n" +
            "\n" +
            "    # Generate Base64 Excel\n" +
            "    if args.type == 'nd':\n" +
            "        b64 = get_workflow_metadata_nd_salalah(args.startDate, args.endDate)\n" +
            "    else:\n" +
            "        b64 = get_workflow_metadata_bill_salalah(args.startDate, args.endDate)\n" +
            "\n" +
            "    # Decode and write the Excel file\n" +
            "    excel_data = base64.b64decode(b64)\n" +
            "    timestamp = datetime.now().strftime(\"%Y%m%d_%H%M%S\")\n" +
            "    filename = f\"{args.type}_{timestamp}.xlsx\"\n" +
            "    filepath = os.path.join(output_dir, filename)\n" +
            "    with open(filepath, 'wb') as f:\n" +
            "        f.write(excel_data)\n" +
            "\n" +
            "    # Print the file path for downstream consumption\n" +
            "    print(filepath)\n" +
            "\n" +
            "if __name__ == '__main__':\n" +
            "    main()\n" +
            "\n";
}