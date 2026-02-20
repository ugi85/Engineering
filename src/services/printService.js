// src/services/printService.js
import { useFrontendConfig } from '@/composables/useConfig'

export const printService = {
  // ✅ GENERATE PRINT HTML DENGAN KONFIGURASI DINAMIS
  generatePrintHtml(title, tableContent, period = '') {
    const { config, getLogoUrl, getFullAddress } = useFrontendConfig()
    
    // Ambil nilai konfigurasi
    const systemName = config.value.systemName
    const companyName = config.value.companyName
    const logoUrl = getLogoUrl.value
    const addressHtml = getFullAddress.value
    const documentRef = isCalibration 
      ? config.value.documentRefCalibration 
      : config.value.documentRefEquipment
    const orientation = config.value.print.orientation
    const margin = config.value.print.margin
    const headerHeight = config.value.print.headerHeight
    const fontFamily = config.value.print.fontFamily
    const showLogo = config.value.print.showLogo
    const showAddress = config.value.print.showAddress
    const showDocumentRef = config.value.print.showDocumentRef
    
    // Format tanggal cetak
    const now = new Date()
    const printDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    return `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>${title} - ${systemName}</title>
        <style>
          @page {
            size: ${orientation};
            margin: ${margin};
          }
          
          body {
            font-family: ${fontFamily};
            padding: 15mm;
            color: #333;
            line-height: 1.5;
          }
          
          .print-header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 3px solid #0056b3;
            padding-bottom: 20px;
          }
          
          .company-logo {
            max-height: 40px;
            max-width: 150px;
            margin-bottom: 10px;
          }
          
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #003366;
            margin-bottom: 5px;
          }
          
          .company-address {
            font-size: 14px;
            color: #555;
            line-height: 1.4;
            margin-bottom: 3px;
          }
          
          .report-title {
            color: #0056b3;
            margin: 15px 0 10px;
            font-size: 26px;
            font-weight: bold;
          }
          
          .report-subtitle {
            color: #666;
            font-size: 16px;
            margin: 5px 0;
            font-weight: 500;
          }
          
          .report-period {
            background: #e9ecef;
            padding: 8px 20px;
            border-radius: 25px;
            display: inline-block;
            margin-top: 12px;
            font-weight: bold;
            font-size: 18px;
            color: #0056b3;
          }
          
          .print-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 12px;
          }
          
          .print-table th {
            background-color: #f0f4f7;
            font-weight: 600;
            padding: 10px 8px;
            text-align: left;
            border: 1px solid #ddd;
            font-size: 13px;
          }
          
          .print-table td {
            padding: 8px;
            border: 1px solid #ddd;
            vertical-align: top;
          }
          
          .print-table .text-center {
            text-align: center;
          }
          
          .status-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .status-success {
            background-color: #28a745;
            color: white;
          }
          
          .status-danger {
            background-color: #dc3545;
            color: white;
          }
          
          .completed-row {
            background-color: #f8fdfa !important;
          }
          
          .print-footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }
          
          .footer-timestamp {
            font-weight: 500;
            color: #0056b3;
            margin-bottom: 5px;
          }
          
          .footer-page {
            margin-top: 3px;
          }
          
          .footer-disclaimer {
            margin-top: 15px;
            font-style: italic;
            color: #888;
            font-size: 11px;
          }
          
          @media print {
            body {
              padding: ${margin};
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .print-table {
              font-size: 11px;
            }
            
            .print-table th {
              padding: 8px 6px;
              font-size: 12px;
            }
            
            .print-table td {
              padding: 6px;
            }
            
            .status-badge {
              padding: 2px 6px;
              font-size: 10px;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          ${showLogo ? `<img src="${logoUrl}" alt="Logo" class="company-logo">` : ''}
          <div class="company-name">${companyName}</div>
          ${showAddress ? `<div class="company-address" style="line-height:1.4">${addressHtml}</div>` : ''}
          
          <h1 class="report-title">${title}</h1>
          ${showDocumentRef ? `<div class="report-subtitle">No. Reff: ${documentRef}</div>` : ''}
          ${period ? `<div class="report-period">Periode: ${period}</div>` : ''}
        </div>
        
        ${tableContent}
        
        <div class="print-footer">
          <div class="footer-timestamp">Dicetak pada: ${printDate}</div>
          <div class="footer-page">Halaman 1 dari 1</div>
          <div class="footer-disclaimer">
            Dokumen ini dihasilkan secara otomatis oleh ${systemName} v${config.value.systemVersion}. 
            Setiap perubahan harus melalui prosedur kontrol dokumen yang berlaku.
          </div>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            }, 300);
          };
        </script>
      </body>
      </html>
    `
  },
  

  // ✅ PRINT DAFTAR ALAT
  printDaftarAlat(alat, title = 'DAFTAR ALAT') {
    // Generate table content
    let tableContent = `
      <table class="print-table">
        <thead>
          <tr>
            <th>No</th>
            <th>No. ID</th>
            <th>Description</th>
            <th>Type/Model</th>
            <th>SN</th>
            <th>Year</th>
            <th>Location</th>
            <th>Criticality</th>
            <th>PM</th>
            <th>Calibration</th>
          </tr>
        </thead>
        <tbody>
    `
    
    alat.forEach((item, index) => {
      tableContent += `
        <tr>
          <td class="text-center">${index + 1}</td>
          <td>${item['No. ID'] || ''}</td>
          <td>${item.Description || ''}</td>
          <td>${item['Type/Model'] || ''}</td>
          <td>${item.SN || ''}</td>
          <td>${item.Year || ''}</td>
          <td>${item.Location || ''}</td>
          <td>${item.Criticality || ''}</td>
          <td class="text-center">${item['PM Y/N'] || ''}</td>
          <td class="text-center">${item['Y/N'] || ''}</td>
        </tr>
      `
    })
    
    tableContent += `
        </tbody>
      </table>
    `
    
    // Generate print window
    const printWindow = window.open('', '_blank', 'width=1200,height=800')
    if (!printWindow) {
      alert('Popup blocker menghalangi pencetakan. Silakan izinkan popup.')
      return
    }
    
    const html = this.generatePrintHtml(
      title,
      tableContent,
      '', // Tidak ada periode
      false // BUKAN jadwal kalibrasi
    )
    
    printWindow.document.write(html)
    printWindow.document.close()
  },

    // ✅ PRINT JADWAL KALIBRASI
  printJadwalKalibrasi(jadwal, month, year) {
    // Generate table content
    let tableContent = `
      <table class="print-table">
        <thead>
          <tr>
            <th>No</th>
            <th>No.ID</th>
            <th>Description</th>
            <th>Calibration ID</th>
            <th>Parameter</th>
            <th>Process Range</th>
            <th>Reject Error</th>
            <th>Due Date</th>
            <th>Remark</th>
            <th>Criticality</th>
          </tr>
        </thead>
        <tbody>
    `
    
    jadwal.forEach((item, index) => {
      tableContent += `
        <tr>
          <td class="text-center">${index + 1}</td>
          <td>${item['No.ID'] || ''}</td>
          <td>${item.Description || ''}</td>
          <td>${item['Calibration Id.'] || ''}</td>
          <td>${item.Parameter || ''}</td>
          <td>${item['Process Range'] || ''}</td>
          <td>${item['Reject Error Limit'] || ''}</td>
          <td class="text-center">${item['Due Date'] || ''}</td>
          <td>${item.Remark || ''}</td>
          <td>${item.Criticality || ''}</td>
        </tr>
      `
    })
    
    tableContent += `
        </tbody>
      </table>
    `
    
    // Generate print window
    const printWindow = window.open('', '_blank', 'width=1200,height=800')
    if (!printWindow) {
      alert('Popup blocker menghalangi pencetakan. Silakan izinkan popup.')
      return
    }
    
    const html = this.generatePrintHtml(
      'LAPORAN JADWAL KALIBRASI',
      tableContent,
      `${month} ${year}`,
      true // INI JADWAL KALIBRASI
    )
    
    printWindow.document.write(html)
    printWindow.document.close()
  },
  
  // Helper format tanggal
  formatDate(dateString) {
    if (!dateString) return ''
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-')
      return `${day}/${month}/${year}`
    }
    try {
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
      }
    } catch (e) {}
    return dateString
  }
}