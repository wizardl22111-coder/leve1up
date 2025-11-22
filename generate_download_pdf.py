#!/usr/bin/env python3
"""
Professional PDF Delivery Note Generator for Digital Products
============================================================

This script generates high-quality PDF delivery notes for digital products with:
- Arabic/English support with proper RTL/LTR layout
- QR codes for easy mobile access
- Clickable hyperlinks
- Professional branding with logo support
- Expiry date management
- Link shortening capability (stub implementation)

Required dependencies:
    pip install reportlab pillow qrcode python-dateutil

Font setup for Arabic support:
    Download "Noto Naskh Arabic" TTF from Google Fonts:
    https://fonts.google.com/noto/specimen/Noto+Naskh+Arabic
    Place the TTF file in the same directory as this script.

Security considerations:
- Never embed secrets or API keys in download links
- Use signed URLs with expiration for sensitive content
- Consider using services like SendOwl, Gumroad for secure delivery
- Implement backend link validation and rate limiting

Expected PDF layout:
+----------------------------------+
| [LOGO]           Store Name      |
+----------------------------------+
|                                  |
|        Product Title             |
|        Product Subtitle          |
|                                  |
|   [QR CODE]    Download Link     |
|                                  |
|   Download Instructions:         |
|   1. Click the link above        |
|   2. Download the file           |
|   3. Extract if compressed       |
|                                  |
|   Support: email@domain.com      |
|   Buyer: Customer Name           |
|   Generated: 2024-01-01          |
|   Valid for: N days              |
+----------------------------------+

Author: Level Up Digital Store
Version: 1.0.0
"""

import argparse
import json
import os
import sys
import textwrap
from datetime import datetime, timedelta
from io import BytesIO
from pathlib import Path
from typing import Dict, Optional, Tuple
from urllib.parse import urlparse

import qrcode
from PIL import Image
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as RLImage
from reportlab.platypus.flowables import HRFlowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


class PDFDeliveryGenerator:
    """Main class for generating PDF delivery notes."""
    
    def __init__(self, config: Dict):
        """Initialize with configuration dictionary."""
        self.config = config
        self.arabic_font_name = "NotoNaskhArabic"
        self.fallback_font = "Helvetica"
        self.setup_fonts()
        
    def setup_fonts(self):
        """Setup Arabic fonts if available, fallback to standard fonts."""
        try:
            # Try to register Arabic font
            font_path = Path("NotoNaskhArabic-Regular.ttf")
            if font_path.exists():
                pdfmetrics.registerFont(TTFont(self.arabic_font_name, str(font_path)))
                print(f"✅ Arabic font loaded: {font_path}")
            else:
                print("⚠️  Arabic font not found. Download 'Noto Naskh Arabic' for better Arabic support.")
                print("   URL: https://fonts.google.com/noto/specimen/Noto+Naskh+Arabic")
                self.arabic_font_name = self.fallback_font
        except Exception as e:
            print(f"⚠️  Font loading error: {e}")
            self.arabic_font_name = self.fallback_font

    def validate_url(self, url: str) -> bool:
        """Basic URL validation."""
        try:
            result = urlparse(url)
            return all([result.scheme, result.netloc])
        except Exception:
            return False

    def shorten_link_stub(self, url: str) -> str:
        """
        Stub implementation for link shortening.
        
        In production, integrate with services like:
        - Bitly API: https://dev.bitly.com/
        - Rebrandly API: https://developers.rebrandly.com/
        - TinyURL API: https://tinyurl.com/app/dev
        
        Example Bitly integration:
        ```python
        import requests
        headers = {'Authorization': f'Bearer {BITLY_TOKEN}'}
        data = {'long_url': url}
        response = requests.post('https://api-ssl.bitly.com/v4/shorten', 
                               headers=headers, json=data)
        return response.json()['link']
        ```
        """
        if self.config.get('use_shortener', False):
            print("🔗 Link shortening requested (using stub - returns original URL)")
            # In production, implement actual shortening service here
            return url
        return url

    def generate_qr_code(self, data: str) -> BytesIO:
        """Generate QR code as BytesIO object."""
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(data)
        qr.make(fit=True)
        
        # Create QR code image
        qr_img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to BytesIO
        img_buffer = BytesIO()
        qr_img.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        return img_buffer

    def get_page_size(self) -> Tuple[float, float]:
        """Get page size based on format preference."""
        format_type = self.config.get('format', 'A4').upper()
        if format_type == 'EBOOK':
            # 6x9 inch format common for ebooks
            return (6 * inch, 9 * inch)
        return A4

    def get_text_direction(self) -> str:
        """Determine text direction based on locale."""
        locale = self.config.get('locale', 'ar')
        return 'rtl' if locale.startswith('ar') else 'ltr'

    def get_localized_text(self, key: str) -> str:
        """Get localized text based on locale."""
        locale = self.config.get('locale', 'ar')
        
        texts = {
            'ar': {
                'store_name': 'متجر لفل اب',
                'download_here': 'اضغط هنا للتحميل',
                'instructions_title': 'تعليمات التحميل:',
                'instruction_1': '1. اضغط على الرابط أعلاه أو امسح رمز QR',
                'instruction_2': '2. قم بتحميل الملف على جهازك',
                'instruction_3': '3. فك الضغط إذا كان الملف مضغوطاً',
                'instruction_4': '4. للدعم التقني تواصل معنا عبر الإيميل',
                'support': 'للدعم:',
                'buyer': 'المشتري:',
                'generated': 'تاريخ الإنشاء:',
                'valid_for': 'صالح لمدة:',
                'days': 'أيام',
                'unlimited': 'غير محدود',
                'scan_qr': 'امسح رمز QR للتحميل المباشر'
            },
            'en': {
                'store_name': 'Level Up Store',
                'download_here': 'Download Here',
                'instructions_title': 'Download Instructions:',
                'instruction_1': '1. Click the link above or scan the QR code',
                'instruction_2': '2. Download the file to your device',
                'instruction_3': '3. Extract if the file is compressed',
                'instruction_4': '4. Contact support via email for technical help',
                'support': 'Support:',
                'buyer': 'Buyer:',
                'generated': 'Generated:',
                'valid_for': 'Valid for:',
                'days': 'days',
                'unlimited': 'unlimited',
                'scan_qr': 'Scan QR code for direct download'
            }
        }
        
        lang = 'ar' if locale.startswith('ar') else 'en'
        return texts[lang].get(key, key)

    def create_styles(self):
        """Create custom paragraph styles."""
        styles = getSampleStyleSheet()
        direction = self.get_text_direction()
        font_name = self.arabic_font_name
        
        # Title style
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Title'],
            fontName=font_name,
            fontSize=24,
            spaceAfter=12,
            alignment=1,  # Center
            textColor=colors.HexColor('#1a365d'),
            leading=30
        )
        
        # Subtitle style
        subtitle_style = ParagraphStyle(
            'CustomSubtitle',
            parent=styles['Normal'],
            fontName=font_name,
            fontSize=16,
            spaceAfter=20,
            alignment=1,  # Center
            textColor=colors.HexColor('#4a5568'),
            leading=20
        )
        
        # Body style
        body_style = ParagraphStyle(
            'CustomBody',
            parent=styles['Normal'],
            fontName=font_name,
            fontSize=12,
            spaceAfter=6,
            alignment=2 if direction == 'rtl' else 0,  # Right for RTL, Left for LTR
            leading=16
        )
        
        # Link style
        link_style = ParagraphStyle(
            'CustomLink',
            parent=styles['Normal'],
            fontName=font_name,
            fontSize=14,
            spaceAfter=12,
            alignment=1,  # Center
            textColor=colors.HexColor('#3182ce'),
            leading=18
        )
        
        return {
            'title': title_style,
            'subtitle': subtitle_style,
            'body': body_style,
            'link': link_style
        }

    def prepare_assets(self) -> Dict:
        """Prepare all assets needed for PDF generation."""
        assets = {}
        
        # Process download link
        download_link = self.config['download_link']
        if not self.validate_url(download_link):
            raise ValueError(f"Invalid URL format: {download_link}")
        
        # Shorten link if requested
        processed_link = self.shorten_link_stub(download_link)
        assets['download_link'] = processed_link
        
        # Generate QR code
        assets['qr_code'] = self.generate_qr_code(processed_link)
        
        # Load logo if provided
        logo_path = self.config.get('logo_path')
        if logo_path and Path(logo_path).exists():
            assets['logo'] = logo_path
        else:
            assets['logo'] = None
            if logo_path:
                print(f"⚠️  Logo file not found: {logo_path}")
        
        return assets

    def compose_pdf(self, assets: Dict) -> str:
        """Compose the final PDF document."""
        output_path = self.config.get('output_path', './delivery_note.pdf')
        page_size = self.get_page_size()
        
        # Create document
        doc = SimpleDocTemplate(
            output_path,
            pagesize=page_size,
            rightMargin=20*mm,
            leftMargin=20*mm,
            topMargin=20*mm,
            bottomMargin=20*mm
        )
        
        # Build content
        story = []
        styles = self.create_styles()
        
        # Header with logo and store name
        self._add_header(story, assets, styles)
        
        # Title and subtitle
        self._add_title_section(story, styles)
        
        # QR code and download link
        self._add_download_section(story, assets, styles)
        
        # Instructions
        self._add_instructions(story, styles)
        
        # Footer information
        self._add_footer(story, styles)
        
        # Build PDF
        try:
            doc.build(story)
            print(f"✅ PDF generated successfully: {output_path}")
            return output_path
        except Exception as e:
            raise RuntimeError(f"Failed to generate PDF: {e}")

    def _add_header(self, story, assets, styles):
        """Add header with logo and store name."""
        if assets['logo']:
            try:
                logo = RLImage(assets['logo'], width=40*mm, height=40*mm)
                story.append(logo)
                story.append(Spacer(1, 10*mm))
            except Exception as e:
                print(f"⚠️  Could not load logo: {e}")
        
        # Store name
        store_name = self.get_localized_text('store_name')
        header = Paragraph(f"<b>{store_name}</b>", styles['title'])
        story.append(header)
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e2e8f0')))
        story.append(Spacer(1, 15*mm))

    def _add_title_section(self, story, styles):
        """Add product title and subtitle."""
        title = self.config['product_title']
        title_para = Paragraph(f"<b>{title}</b>", styles['title'])
        story.append(title_para)
        
        subtitle = self.config.get('product_subtitle')
        if subtitle:
            subtitle_para = Paragraph(subtitle, styles['subtitle'])
            story.append(subtitle_para)
        
        story.append(Spacer(1, 10*mm))

    def _add_download_section(self, story, assets, styles):
        """Add QR code and download link section."""
        # QR Code
        qr_image = RLImage(assets['qr_code'], width=60*mm, height=60*mm)
        story.append(qr_image)
        story.append(Spacer(1, 5*mm))
        
        # QR instruction
        qr_text = self.get_localized_text('scan_qr')
        qr_para = Paragraph(f"<i>{qr_text}</i>", styles['body'])
        story.append(qr_para)
        story.append(Spacer(1, 8*mm))
        
        # Download link
        download_text = self.get_localized_text('download_here')
        link_url = assets['download_link']
        link_para = Paragraph(
            f'<b><a href="{link_url}" color="blue">{download_text}</a></b>',
            styles['link']
        )
        story.append(link_para)
        story.append(Spacer(1, 15*mm))

    def _add_instructions(self, story, styles):
        """Add download instructions."""
        instructions_title = self.get_localized_text('instructions_title')
        title_para = Paragraph(f"<b>{instructions_title}</b>", styles['body'])
        story.append(title_para)
        story.append(Spacer(1, 5*mm))
        
        # Instructions list
        for i in range(1, 5):
            instruction = self.get_localized_text(f'instruction_{i}')
            inst_para = Paragraph(instruction, styles['body'])
            story.append(inst_para)
        
        story.append(Spacer(1, 15*mm))

    def _add_footer(self, story, styles):
        """Add footer with support info and metadata."""
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e2e8f0')))
        story.append(Spacer(1, 8*mm))
        
        # Support email
        support_text = self.get_localized_text('support')
        vendor_email = self.config.get('vendor_email', 'support@levelup.com')
        support_para = Paragraph(f"{support_text} {vendor_email}", styles['body'])
        story.append(support_para)
        
        # Buyer name
        buyer_name = self.config.get('buyer_name')
        if buyer_name:
            buyer_text = self.get_localized_text('buyer')
            buyer_para = Paragraph(f"{buyer_text} {buyer_name}", styles['body'])
            story.append(buyer_para)
        
        # Generation date
        generated_text = self.get_localized_text('generated')
        current_date = datetime.now().strftime('%Y-%m-%d')
        date_para = Paragraph(f"{generated_text} {current_date}", styles['body'])
        story.append(date_para)
        
        # Expiry information
        expiry_days = self.config.get('expiry_days', 0)
        if expiry_days > 0:
            valid_text = self.get_localized_text('valid_for')
            days_text = self.get_localized_text('days')
            expiry_para = Paragraph(f"{valid_text} {expiry_days} {days_text}", styles['body'])
            story.append(expiry_para)


def load_config_file(config_path: str) -> Dict:
    """Load configuration from JSON file."""
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        raise FileNotFoundError(f"Configuration file not found: {config_path}")
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in configuration file: {e}")


def create_sample_config() -> Dict:
    """Create sample configuration for demonstration."""
    return {
        'product_title': 'باقة المونتاج الاحترافية',
        'product_subtitle': 'مجموعة شاملة من القوالب والمؤثرات الاحترافية',
        'download_link': 'https://drive.google.com/file/d/1234567890abcdef/view',
        'logo_path': None,
        'output_path': './professional_editing_package_delivery.pdf',
        'vendor_email': 'leve1up999q@gmail.com',
        'buyer_name': 'أحمد محمد',
        'expiry_days': 7,
        'use_shortener': False,
        'locale': 'ar',
        'format': 'A4'
    }


def main():
    """Main CLI interface."""
    parser = argparse.ArgumentParser(
        description='Generate professional PDF delivery notes for digital products',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent('''
        Examples:
          %(prog)s --title "باقة المونتاج الاحترافية" --link "https://drive.google.com/file/d/xyz"
          %(prog)s --config config.json
          %(prog)s --title "Pro Editing Pack" --subtitle "Complete templates collection" --locale en
        
        Configuration file format (JSON):
        {
          "product_title": "باقة المونتاج الاحترافية",
          "product_subtitle": "مجموعة شاملة من القوالب",
          "download_link": "https://drive.google.com/file/d/xyz",
          "buyer_name": "أحمد محمد",
          "expiry_days": 7,
          "locale": "ar"
        }
        ''')
    )
    
    parser.add_argument('--title', help='Product title (Arabic/English)')
    parser.add_argument('--subtitle', help='Product subtitle (optional)')
    parser.add_argument('--link', help='Download link URL')
    parser.add_argument('--logo', help='Path to logo file (PNG/SVG)')
    parser.add_argument('--output', default='./delivery_note.pdf', help='Output PDF path')
    parser.add_argument('--email', default='leve1up999q@gmail.com', help='Vendor support email')
    parser.add_argument('--buyer', help='Buyer name (optional)')
    parser.add_argument('--expiry', type=int, default=0, help='Link expiry in days (0 = no expiry)')
    parser.add_argument('--shorten', action='store_true', help='Use link shortener (stub)')
    parser.add_argument('--locale', default='ar', choices=['ar', 'en'], help='Language locale')
    parser.add_argument('--format', default='A4', choices=['A4', 'EBOOK'], help='Page format')
    parser.add_argument('--config', help='Load configuration from JSON file')
    
    args = parser.parse_args()
    
    try:
        # Load configuration
        if args.config:
            config = load_config_file(args.config)
            print(f"📄 Loaded configuration from: {args.config}")
        elif args.title and args.link:
            # Build config from CLI arguments
            config = {
                'product_title': args.title,
                'product_subtitle': args.subtitle,
                'download_link': args.link,
                'logo_path': args.logo,
                'output_path': args.output,
                'vendor_email': args.email,
                'buyer_name': args.buyer,
                'expiry_days': args.expiry,
                'use_shortener': args.shorten,
                'locale': args.locale,
                'format': args.format
            }
        else:
            print("🚀 No arguments provided. Running demonstration with sample data...")
            config = create_sample_config()
        
        # Generate PDF
        print("📝 Generating PDF delivery note...")
        generator = PDFDeliveryGenerator(config)
        assets = generator.prepare_assets()
        output_file = generator.compose_pdf(assets)
        
        print(f"🎉 Success! PDF generated: {output_file}")
        return 0
        
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    # Demonstration run if no arguments provided
    if len(sys.argv) == 1:
        print("🎯 PDF Delivery Note Generator - Demonstration Mode")
        print("=" * 50)
        
        # Create sample configuration
        sample_config = create_sample_config()
        
        print("📋 Sample configuration:")
        for key, value in sample_config.items():
            print(f"   {key}: {value}")
        print()
        
        try:
            # Generate demonstration PDF
            generator = PDFDeliveryGenerator(sample_config)
            assets = generator.prepare_assets()
            output_file = generator.compose_pdf(assets)
            
            print(f"✅ Demonstration PDF created: {output_file}")
            print("\n💡 To use with your own data:")
            print("   python generate_download_pdf.py --title 'Your Product' --link 'https://your-link.com'")
            print("\n📖 For full options: python generate_download_pdf.py --help")
            
        except Exception as e:
            print(f"❌ Demonstration failed: {e}")
            sys.exit(1)
    else:
        # Run normal CLI mode
        sys.exit(main())

