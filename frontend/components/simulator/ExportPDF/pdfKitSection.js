/**
 * pdfKitSection.js — Page "Kit complet" partagée pour les 4 modules PDF
 *
 * Lit getProjectKit(projectType) → affiche en 2 colonnes :
 *   - 4 outils polyvalents (brand + model + prix + lien Amazon direct ASIN)
 *   - 3 EPI (lien Amazon recherche)
 *   - 2 fournitures (lien Amazon recherche ou direct)
 *
 * Total estimé outils + disclaimer affiliation en pied.
 */

import { getProjectKit, buildAmazonUrl } from '@/lib/projectTools';

/**
 * Dessine la section Kit dans un PDF jsPDF existant.
 * @param {jsPDF} doc            instance jsPDF
 * @param {string} projectType   'terrasse' | 'cabanon' | 'pergola' | 'cloture'
 * @param {string} projectLabel  Libellé humain ("Terrasse bois")
 * @param {number} startY        Position Y de départ (après pageTitle)
 */
export function drawKitSection(doc, projectType, projectLabel, startY) {
  const kit = getProjectKit(projectType);
  if (!kit) return;

  const PAGE_W = 210;
  const M = 15;
  const colW = (PAGE_W - 2 * M - 8) / 2;
  const rowH = 22;
  let y = startY + 4;

  /* ── Bloc total estimé ── */
  doc.setFillColor(252, 246, 222);
  doc.setDrawColor(229, 215, 168);
  doc.roundedRect(M, y, PAGE_W - 2 * M, 16, 3, 3, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(122, 92, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('BUDGET OUTILS POLYVALENTS', M + 5, y + 6.5);

  doc.setFontSize(15);
  doc.text(`~${kit.toolsTotal} €`, M + 5, y + 13);

  doc.setFontSize(7.5);
  doc.setTextColor(120, 110, 100);
  doc.setFont('helvetica', 'italic');
  doc.text('+ EPI & fournitures (prix variables)', M + 5 + 35, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(26, 28, 27);
  y += 20;

  /* ── Section Outils (4 items) ── */
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(122, 92, 0);
  doc.text('OUTILS POLYVALENTS', M, y);
  y += 5;
  doc.setDrawColor(229, 215, 168);
  doc.line(M, y, PAGE_W - M, y);
  y += 4;

  kit.tools.forEach((tool, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = M + col * (colW + 8);
    const cardY = y + row * rowH;
    const url = buildAmazonUrl(tool.amazonQuery, tool.amazonAsin, `${projectType}-pdf-tool`);

    doc.setFillColor(252, 250, 245);
    doc.setDrawColor(229, 226, 216);
    doc.roundedRect(x, cardY, colW, rowH - 3, 2.5, 2.5, 'FD');

    /* Brand + Model */
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 110, 100);
    doc.text((tool.brand || '').toUpperCase(), x + 3, cardY + 5);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 28, 27);
    doc.text(tool.model || tool.name, x + 3, cardY + 10);

    /* Prix à droite */
    if (tool.price != null) {
      doc.setFontSize(10);
      doc.setTextColor(122, 92, 0);
      doc.text(`~${tool.price} €`, x + colW - 3, cardY + 7, { align: 'right' });
    }

    /* CTA Amazon */
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(201, 151, 30);
    doc.text('Voir sur Amazon ->', x + 3, cardY + 16);

    doc.link(x, cardY, colW, rowH - 3, { url });
  });

  y += Math.ceil(kit.tools.length / 2) * rowH + 4;

  /* ── Section EPI + fournitures (compactes, 1 ligne par item) ── */
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(122, 92, 0);
  doc.text('EPI & FOURNITURES ESSENTIELS', M, y);
  y += 5;
  doc.line(M, y, PAGE_W - M, y);
  y += 4;

  const allExtras = [
    ...kit.epi.map(e => ({ ...e, tag: 'EPI' })),
    ...kit.supplies.map(s => ({ ...s, tag: 'FOURNIT.' })),
  ];

  allExtras.forEach((item, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = M + col * (colW + 8);
    const cardY = y + row * 16;
    const url = buildAmazonUrl(item.amazonQuery, item.amazonAsin, `${projectType}-pdf-${item.tag === 'EPI' ? 'epi' : 'sup'}`);

    doc.setFillColor(item.tag === 'EPI' ? 245 : 240, item.tag === 'EPI' ? 248 : 246, item.tag === 'EPI' ? 252 : 234);
    doc.setDrawColor(229, 226, 216);
    doc.roundedRect(x, cardY, colW, 13, 2, 2, 'FD');

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(item.tag === 'EPI' ? 42 : 29, item.tag === 'EPI' ? 84 : 94, item.tag === 'EPI' ? 128 : 50);
    doc.text(item.tag, x + 3, cardY + 4);

    doc.setFontSize(8);
    doc.setTextColor(26, 28, 27);
    doc.setFont('helvetica', 'bold');
    const trimmed = item.name.length > 38 ? item.name.slice(0, 36) + '...' : item.name;
    doc.text(trimmed, x + 3, cardY + 9);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(201, 151, 30);
    doc.text('Voir ->', x + colW - 3, cardY + 9, { align: 'right' });

    doc.link(x, cardY, colW, 13, { url });
  });

  y += Math.ceil(allExtras.length / 2) * 16 + 6;

  /* ── Disclaimer ── */
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(156, 145, 136);
  doc.text(
    'Selection editorialement curee par DIY Builder. Liens affilies Amazon Associates - aucune surcout pour vous.',
    PAGE_W / 2, 270, { align: 'center' },
  );
  doc.setFont('helvetica', 'normal');
}
