import{u as g}from"./index-YFJ9ujwD.js";const $={generatePrintHtml(d,r,i="",n=!1){const{config:e,getLogoUrl:a,getFullAddress:t}=g(),o=e.value.systemName,l=e.value.systemVersion,s=e.value.companyName;a.value,t.value;const p=n?e.value.documentRefCalibration:e.value.documentRefEquipment,w=e.value.print.orientation,c=e.value.print.margin;e.value.print.headerHeight;const y=e.value.print.fontFamily;e.value.print.showLogo,e.value.print.showAddress,e.value.print.showDocumentRef;const h=new Date,u=`${h.getDate().toString().padStart(2,"0")}/${(h.getMonth()+1).toString().padStart(2,"0")}/${h.getFullYear()} ${h.getHours().toString().padStart(2,"0")}:${h.getMinutes().toString().padStart(2,"0")}`;return`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>${d} - ${o}</title>
        <style>
          @page {
            size: ${w};
            margin: ${c};
          }

          body {
            font-family: ${y};
            padding: 0;
            color: #333;
            line-height: 1.3;
            margin: 0;
          }

          .print-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8px;
          }

          .print-table thead th {
            border: 1px solid #000;
            padding: 3px 5px;
            text-align: left;
            background-color: #f0f0f0;
            font-weight: bold;
            font-size: 7px;
            white-space: nowrap;
          }

          .print-table tbody td {
            border: 1px solid #000;
            padding: 3px 5px;
            text-align: left;
          }

          .print-table td.text-center {
            text-align: center;
          }

          .header-info {
            width: 100%;
            margin-bottom: 3px;
            border-bottom: 2px solid #000;
            padding-bottom: 3px;
          }

          .header-line {
            display: block;
            text-align: left;
            font-weight: bold;
            white-space: nowrap;
            margin: 0;
            padding: 0;
            line-height: 1.3;
          }

          .company-name {
            font-size: 14px;
            margin-bottom: 2px;
          }

          .doc-title {
            font-size: 10px;
            margin-bottom: 1px;
          }

          .doc-number {
            font-size: 10px;
          }

          .print-footer {
            margin-top: 8px;
            padding-top: 5px;
            border-top: 1px solid #000;
            font-size: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .footer-left {
            text-align: left;
          }

          .footer-right {
            text-align: right;
            font-weight: bold;
          }

          .footer-timestamp {
            font-weight: bold;
            margin-bottom: 2px;
          }

          @page {
            @bottom-right {
              content: "Hal " counter(page) " of  " counter(pages);
              font-size: 8px;
              font-weight: bold;
              margin-right: 0;
            }
          }

          @media print {
            body {
              padding: ${c};
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .print-table {
              font-size: 7px;
            }

            .print-table thead {
              display: table-header-group;
            }

            .print-table th, .print-table td {
              padding: 2px 4px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header-info">
          <div class="header-line company-name">${s}</div>
          <div class="header-line doc-title">Judul Dokumen : ${d}</div>
          <div class="header-line doc-number">Nomor Dokumen : ${p}</div>
        </div>

        ${r}

        <div class="print-footer">
          <div class="footer-left">
            <div class="footer-timestamp">Dicetak pada: ${u} | ${o} v${l}</div>
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
        <\/script>
      </body>
      </html>
    `},printDaftarAlat(d,r="Daftar Peralatan dan Jadwal Perawatannya"){let i=`
      <table class="print-table">
        <thead>
          <tr>
            <th rowspan="2" style="width: 3%;">No.</th>
            <th rowspan="2" style="width: 8%;">No. ID</th>
            <th rowspan="2" style="width: 15%;">Description</th>
            <th rowspan="2" style="width: 10%;">Type/Model</th>
            <th rowspan="2" style="width: 10%;">SN</th>
            <th rowspan="2" style="width: 5%;">Year</th>
            <th rowspan="2" style="width: 5%;">Criticality<br>(Y/N)</th>
            <th colspan="4" style="width: 16%;">PM</th>
            <th colspan="3" style="width: 12%;">Calibration</th>
            <th rowspan="2" style="width: 5%;">PIC</th>
            <th rowspan="2" style="width: 5%;">Dikerjakan<br>tgl:</th>
            <th rowspan="2" style="width: 10%;">Keterangan</th>
          </tr>
          <tr>
            <th style="width: 4%;">Product</th>
            <th style="width: 4%;">Process</th>
            <th style="width: 4%;">Safety</th>
            <th style="width: 4%;">Enviroment</th>
            <th style="width: 4%;">Y/N</th>
            <th style="width: 4%;">6 Monthly</th>
            <th style="width: 4%;">Yearly</th>
            <th style="width: 4%;">6/12</th>
            <th style="width: 4%;">Y/N</th>
            <th style="width: 4%;">Schedule</th>
          </tr>
        </thead>
        <tbody>
    `;d.forEach((a,t)=>{i+=`
        <tr>
          <td class="text-center">${t+1}</td>
          <td>${a["No. ID"]||""}</td>
          <td>${a.Description||""}</td>
          <td>${a["Type/Model"]||""}</td>
          <td>${a.SN||""}</td>
          <td class="text-center">${a.Year||""}</td>
          <td class="text-center">${a.Criticality||""}</td>
          <td class="text-center">${a["PM Product"]||""}</td>
          <td class="text-center">${a["PM Process"]||""}</td>
          <td class="text-center">${a["PM Safety"]||""}</td>
          <td class="text-center">${a["PM Enviroment"]||""}</td>
          <td class="text-center">${a["PM Y/N"]||""}</td>
          <td class="text-center">${a["Calibration 6 Monthly"]||""}</td>
          <td class="text-center">${a["Calibration Yearly"]||""}</td>
          <td class="text-center">${a["Calibration 6/12"]||""}</td>
          <td class="text-center">${a["Calibration Y/N"]||""}</td>
          <td class="text-center">${a["Calibration Schedule"]||""}</td>
          <td>${a.PIC||""}</td>
          <td class="text-center">${a["Dikerjakan tgl"]||""}</td>
          <td>${a.Keterangan||""}</td>
        </tr>
      `}),i+=`
        </tbody>
      </table>
    `;const n=window.open("","_blank","width=1400,height=800");if(!n){alert("Popup blocker menghalangi pencetakan. Silakan izinkan popup.");return}const e=this.generatePrintHtml(r,i,"",!1);n.document.write(e),n.document.close()},printJadwalKalibrasi(d,r,i){let n=`
      <table class="print-table">
        <thead>
          <tr>
            <th rowspan="2" style="width: 3%;">No</th>
            <th rowspan="2" style="width: 8%;">No.ID</th>
            <th rowspan="2" style="width: 15%;">Description</th>
            <th rowspan="2" style="width: 10%;">Calibration ID</th>
            <th rowspan="2" style="width: 12%;">Parameter</th>
            <th rowspan="2" style="width: 12%;">Process Range</th>
            <th rowspan="2" style="width: 12%;">Reject Error</th>
            <th rowspan="2" style="width: 10%;">Due Date</th>
            <th rowspan="2" style="width: 10%;">Remark</th>
            <th rowspan="2" style="width: 8%;">Criticality</th>
          </tr>
        </thead>
        <tbody>
    `;d.forEach((t,o)=>{n+=`
        <tr>
          <td class="text-center">${o+1}</td>
          <td>${t["No.ID"]||""}</td>
          <td>${t.Description||""}</td>
          <td>${t["Calibration Id."]||""}</td>
          <td>${t.Parameter||""}</td>
          <td>${t["Process Range"]||""}</td>
          <td>${t["Reject Error Limit"]||""}</td>
          <td class="text-center">${this.formatDate(t["Due Date"])||""}</td>
          <td>${t.Remark||""}</td>
          <td>${t.Criticality||""}</td>
        </tr>
      `}),n+=`
        </tbody>
      </table>
    `;const e=window.open("","_blank","width=1400,height=800");if(!e){alert("Popup blocker menghalangi pencetakan. Silakan izinkan popup.");return}const a=this.generatePrintHtml("Jadwal Kalibrasi",n,`${r} ${i}`,!0);e.document.write(a),e.document.close()},printKalibrasiLogs(d,r,i){if(!d||d.length===0){alert("Tidak ada data untuk dicetak");return}let n=`
      <table class="print-table">
        <thead>
          <tr>
            <th style="width: 4%;">No</th>
            <th style="width: 10%;">No.ID</th>
            <th style="width: 15%;">Description</th>
            <th style="width: 12%;">Calibration ID</th>
            <th style="width: 10%;">Parameter</th>
            <th style="width: 12%;">Proses Range</th>
            <th style="width: 12%;">Reject limit</th>
            <th style="width: 8%;">Due Date</th>
            <th style="width: 8%;">PIC</th>
            <th style="width: 9%;">Execute Date</th>
            <th style="width: 15%;">Keterangan</th>
          </tr>
        </thead>
        <tbody>
    `;d.forEach((t,o)=>{const l=this.formatDate(t["Due Date"]),s=this.formatDate(t.execute_date);n+=`
        <tr>
          <td class="text-center">${o+1}</td>
          <td>${t["No.ID"]||""}</td>
          <td>${t.Description||""}</td>
          <td>${t["Calibration Id."]||""}</td>
          <td>${t.Parameter||""}</td>
          <td>${t["Process Range"]||""}</td>
          <td>${t["Reject Error Limit"]||""}</td>
          <td class="text-center">${l}</td>
          <td>${t.pic||""}</td>
          <td class="text-center">${s}</td>
          <td>${t.ket||""}</td>
        </tr>
      `}),n+=`
        </tbody>
      </table>
    `;const e=window.open("","_blank","width=1600,height=800");if(!e){alert("Popup blocker menghalangi pencetakan. Silakan izinkan popup.");return}const a=this.generatePrintHtml("Log Kalibrasi",n,`${r} ${i}`,!0);e.document.write(a),e.document.close()},printPM(d,r,i){if(!d||d.length===0){alert("Tidak ada data untuk dicetak");return}let n=`
      <table class="print-table">
        <thead>
          <tr>
            <th style="width: 5%;">No</th>
            <th style="width: 10%;">No.ID</th>
            <th style="width: 15%;">Description</th>
            <th style="width: 12%;">Type/Model</th>
            <th style="width: 10%;">SN</th>
            <th style="width: 8%;">Interval</th>
            <th style="width: 10%;">Due Date</th>
            <th style="width: 10%;">PIC</th>
            <th style="width: 10%;">Execute Date</th>
            <th style="width: 15%;">Keterangan</th>
          </tr>
        </thead>
        <tbody>
    `;d.forEach((t,o)=>{const l=this.formatDate(t["Due Date"]),s=this.formatDate(t.execute_date);n+=`
        <tr>
          <td class="text-center">${o+1}</td>
          <td>${t["No.ID"]||""}</td>
          <td>${t.Description||""}</td>
          <td>${t["Type/Model"]||t.Parameter||""}</td>
          <td>${t.SN||"-"}</td>
          <td class="text-center">${t.pm_interval||"-"}</td>
          <td class="text-center">${l}</td>
          <td>${t.pic||""}</td>
          <td class="text-center">${s}</td>
          <td>${t.ket||""}</td>
        </tr>
      `}),n+=`
        </tbody>
      </table>
    `;const e=window.open("","_blank","width=1600,height=800");if(!e){alert("Popup blocker menghalangi pencetakan. Silakan izinkan popup.");return}const a=this.generatePrintHtml("Log PM",n,`${r} ${i}`,!1);e.document.write(a),e.document.close()},printAllActivity(d,r,i){if(!d||d.length===0){alert("Tidak ada data untuk dicetak");return}let n=`
      <table class="print-table">
        <thead>
          <tr>
            <th style="width: 5%;">No</th>
            <th style="width: 10%;">No.ID</th>
            <th style="width: 15%;">Description</th>
            <th style="width: 12%;">Log ID</th>
            <th style="width: 10%;">Jenis</th>
            <th style="width: 12%;">PIC</th>
            <th style="width: 12%;">Execute Date</th>
            <th style="width: 24%;">Keterangan</th>
          </tr>
        </thead>
        <tbody>
    `;d.forEach((t,o)=>{const l=this.formatDate(t.execute_date)||this.formatDate(t.tanggal)||"-";n+=`
        <tr>
          <td class="text-center">${o+1}</td>
          <td>${t.no_id||"-"}</td>
          <td>${t.description||t.type_model||"-"}</td>
          <td>${t.cal_id||"-"}</td>
          <td class="text-center">${t.jenis||"-"}</td>
          <td>${t.petugas||"-"}</td>
          <td class="text-center">${l}</td>
          <td>${t.keterangan||"-"}</td>
        </tr>
      `}),n+=`
        </tbody>
      </table>
    `;const e=window.open("","_blank","width=1600,height=800");if(!e){alert("Popup blocker menghalangi pencetakan. Silakan izinkan popup.");return}const a=this.generatePrintHtml("Log Aktivitas",n,`${r} ${i}`,!1);e.document.write(a),e.document.close()},formatDate(d){if(!d)return"";if(/^\d{4}-\d{2}-\d{2}$/.test(d)){const[r,i,n]=d.split("-");return`${n}/${i}/${r}`}try{const r=new Date(d);if(!isNaN(r.getTime())){const i=String(r.getDate()).padStart(2,"0"),n=String(r.getMonth()+1).padStart(2,"0"),e=r.getFullYear();return`${i}/${n}/${e}`}}catch{}return d}};export{$ as p};
