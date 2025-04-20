
#!/usr/bin/env python3
import argparse
import os
import json
from collections import defaultdict
from datetime import datetime
import pandas as pd
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import arabic_reshaper
from bidi.algorithm import get_display

# Register a Unicode font that supports Arabic
WORKFLOW_NAME = "Electricity_SALALAH_RAECO"

# --- CLI args parsing ---
def parse_args():
    parser = argparse.ArgumentParser(
        description="Generate PDFs from a provided Excel file grouped by GEO_CODE"
    )
    parser.add_argument(
        "--inputFile", required=True,
        help="Path to the Excel file containing Title and GEO_CODE columns"
    )
    parser.add_argument(
        "--outputDir", default=None,
        help="Directory where PDF files will be written (defaults to '../output')"
    )
    return parser.parse_args()

# --- Setup font and directories ---
def setup(env):
    # Register Arabic font
    # pdfmetrics.registerFont(
    #     TTFont(
    #         "Arabic",
    #         os.path.join(env['script_dir'], "font/NotoSansArabic-VariableFont_wdth,wght.ttf"),
    #     )
    # )

    font_path = os.path.join(script_dir, "font", "NotoSansArabic-Regular.ttf")
    if os.path.isfile(font_path):
        pdfmetrics.registerFont(TTFont("Arabic", font_path))
        ARABIC_FONT = "Arabic"
    else:
        ARABIC_FONT = "Helvetica"
        print(f"[WARN] Missing Arabic TTF at {font_path}, falling back to {ARABIC_FONT}", file=sys.stderr)


    # Determine output directory
    if env['outputDir']:
        output_dir = env['outputDir']
    else:
        project_root = os.path.dirname(env['script_dir'])
        output_dir = os.path.join(project_root, 'output')
    os.makedirs(output_dir, exist_ok=True)
    return output_dir

# --- Load and group Excel data ---
def load_account_numbers(excel_path):
    # df = pd.read_excel(excel_path, dtype=str)
    # return set(df['Title'].dropna().astype(str))
    df = pd.read_excel(excel_path, dtype=str)
    # the RAECO report calls the account field "ACC_NO"
    return set(df['ACC_NO'].dropna().astype(str))


def get_data_excel(excel_path):
    # df = pd.read_excel(excel_path, dtype=str)
    # grouped = defaultdict(list)
    # for _, row in df.iterrows():
    #     code = row.get('GEO_CODE', '').strip()
    #     grouped[code].append(row)
    df = pd.read_excel(excel_path, dtype=str)
    grouped = defaultdict(list)
    for _, row in df.iterrows():
            # in the RAECO report, area/reader code is in "READER_CODE"
        code = row.get('READER_CODE', '').strip()
        grouped[code].append(row)
    # sort each group by Title
    for code in grouped:
        grouped[code].sort(key=lambda r: r.get('Title', ''))
    return grouped

# --- PDF generation utilities ---
def process_arabic_text(text):
    reshaped = arabic_reshaper.reshape(text)
    return get_display(reshaped)


def draw_centered_text(pdf_canvas, page_width, y, text):
    txt = process_arabic_text(str(text))
    pdf_canvas.setFont("Arabic", 10)
    w = pdf_canvas.stringWidth(txt)
    x = (page_width - w) / 2
    pdf_canvas.drawString(x, y, txt)

# --- PDF generators ---
def generate_el_pdf_from_excel(rows, file_path):
    pdf = canvas.Canvas(file_path, pagesize=A4)
    page_width, _ = A4
    for row in rows:
        account_no = row.get('Title', '')
        area_code = row.get('GEO_CODE', '')
        meter_no = str(row.get('METERNO', '')).strip()
        outstanding = round(float(row.get('Outstanding Init', 0) or 0), 3)
        sep = ' ' * 60
        date_str = datetime.now().strftime("%d-%b-%Y")
        draw_centered_text(pdf, page_width, 687, f"{date_str}{sep}{date_str}")
        draw_centered_text(pdf, page_width, 672, f"{area_code}{sep}{area_code}")
        draw_centered_text(pdf, page_width, 655, row.get('CONS_NAME', ''))
        draw_centered_text(pdf, page_width, 637, f"{account_no}{sep}{account_no}")
        draw_centered_text(pdf, page_width, 620, f"{meter_no}{sep}{meter_no}")
        draw_centered_text(pdf, page_width, 602, f"{outstanding}{sep}{outstanding}")
        pdf.showPage()
    pdf.save()


def generate_pdf_water(rows, file_path):
    pdf = canvas.Canvas(file_path, pagesize=A4)
    page_width, _ = A4
    for row in rows:
        account_no = row.get('Title', '')
        area_code = row.get('GEO_CODE', '')
        meter_no = str(row.get('METERNO', '')).strip()
        outstanding = round(float(row.get('Outstanding Init', 0) or 0), 3)
        sep = ' ' * 60
        date_str = datetime.now().strftime("%b-%Y")
        draw_centered_text(pdf, page_width, 648, row.get('CONSUMER_NAME', 'N/A'))
        draw_centered_text(pdf, page_width, 618, f"{account_no}{sep}{account_no}")
        draw_centered_text(pdf, page_width, 588, f"{outstanding}{sep}{outstanding}")
        draw_centered_text(pdf, page_width, 558, f"{date_str}{sep}{date_str}")
        draw_centered_text(pdf, page_width, 535, f"{area_code}{sep}{area_code}")
        pdf.showPage()
    pdf.save()

# --- Main processing ---
def process_data(input_file, output_dir):
    valid_accounts = load_account_numbers(input_file)
    grouped = get_data_excel(input_file)
    date_folder = f"ND_output_{datetime.now().strftime('%d-%B-%Y')}"
    target_dir = os.path.join(output_dir, date_folder, WORKFLOW_NAME)
    os.makedirs(target_dir, exist_ok=True)
    for code, rows in grouped.items():
        out_pdf = os.path.join(target_dir, f"{code}.pdf")
        if 'water' in WORKFLOW_NAME.lower():
            generate_pdf_water(rows, out_pdf)
        else:
            generate_el_pdf_from_excel(rows, out_pdf)
    print(target_dir)

if __name__ == '__main__':
    args = parse_args()
    script_dir = os.path.dirname(os.path.abspath(__file__))
    env = {'script_dir': script_dir, 'outputDir': args.outputDir}
    output_dir = setup(env)
    process_data(args.inputFile, output_dir)

