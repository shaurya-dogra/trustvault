
import { Contract, Milestone } from '../types';

export const generateContractHTML = (contract: Contract): string => {
  const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const totalValue = contract.totalValue.toLocaleString('en-IN');
  
  const milestoneRows = contract.milestones.map((m, i) => `
    <tr style="page-break-inside: avoid;">
      <td style="padding: 12px; border: 1px solid #e2e8f0; vertical-align: top;">${i + 1}</td>
      <td style="padding: 12px; border: 1px solid #e2e8f0; vertical-align: top;">
        <strong>${m.title}</strong><br/>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">${m.description}</div>
        <div style="margin-top: 8px; font-size: 11px;">
            <strong>Deliverables:</strong><br/>
            ${m.deliverables.map(d => `• ${d.description}`).join('<br/>')}
        </div>
      </td>
      <td style="padding: 12px; border: 1px solid #e2e8f0; vertical-align: top;">
        <div style="font-size: 11px;">
            <strong>Acceptance Criteria:</strong><br/>
            ${m.acceptanceCriteria.map(ac => `• ${ac}`).join('<br/>')}
        </div>
      </td>
      <td style="padding: 12px; border: 1px solid #e2e8f0; vertical-align: top;">${m.deadline}</td>
      <td style="padding: 12px; border: 1px solid #e2e8f0; vertical-align: top; font-family: monospace; font-weight: bold;">₹${m.amount.toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Independent Contractor Agreement - ${contract.id}</title>
        <style>
          @page { margin: 2.5cm; }
          body { 
            font-family: 'Times New Roman', serif; 
            line-height: 1.5; 
            color: #1e293b; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
          }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #0f172a; padding-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; }
          .subtitle { font-size: 12px; color: #64748b; margin-top: 5px; text-transform: uppercase; }
          
          .section { margin-bottom: 25px; }
          h2 { 
            font-size: 14px; 
            text-transform: uppercase; 
            border-bottom: 1px solid #cbd5e1; 
            padding-bottom: 5px; 
            margin-top: 30px; 
            color: #334155; 
          }
          p { margin-bottom: 12px; font-size: 13px; text-align: justify; }
          li { font-size: 13px; margin-bottom: 8px; text-align: justify; }
          
          .parties-box { 
            background: #f8fafc; 
            border: 1px solid #e2e8f0; 
            padding: 20px; 
            margin-bottom: 30px; 
            display: flex; 
            justify-content: space-between;
          }
          .party { width: 45%; font-size: 13px; }
          .party strong { display: block; text-transform: uppercase; font-size: 11px; color: #64748b; margin-bottom: 4px; }
          .party-name { font-weight: bold; font-size: 15px; color: #0f172a; }
          
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
          th { background: #f1f5f9; text-align: left; padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; font-size: 11px; text-transform: uppercase; }
          
          .signatures { margin-top: 60px; display: flex; justify-content: space-between; page-break-inside: avoid; }
          .sig-block { width: 45%; border-top: 1px solid #0f172a; padding-top: 15px; }
          .sig-label { font-size: 11px; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
          .sig-val { font-size: 14px; font-weight: bold; font-family: 'Courier New', monospace; }
          
          .hash-block { 
            margin-top: 40px; 
            border: 2px dashed #cbd5e1; 
            background: #f8fafc; 
            padding: 15px; 
            text-align: center; 
            page-break-inside: avoid;
          }
          .hash-code { 
            font-family: 'Courier New', monospace; 
            font-size: 11px; 
            word-break: break-all; 
            color: #475569; 
            margin-top: 5px; 
          }
          
          .footer { 
            margin-top: 50px; 
            text-align: center; 
            font-size: 10px; 
            color: #94a3b8; 
            border-top: 1px solid #e2e8f0; 
            padding-top: 10px; 
          }
          
          @media print { 
            body { padding: 0; } 
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Independent Contractor Agreement</div>
          <div class="subtitle">TrustVault Protocol • Contract ID: ${contract.id}</div>
        </div>

        <div class="parties-box">
          <div class="party">
            <strong>Client</strong>
            <div class="party-name">${contract.clientName}</div>
            <div>Authorized Principal</div>
          </div>
          <div class="party">
            <strong>Contractor (Freelancer)</strong>
            <div class="party-name">${contract.freelancerName}</div>
            <div>Independent Service Provider</div>
          </div>
        </div>

        <p>This Independent Contractor Agreement (the "Agreement") is entered into as of <strong>${date}</strong> (the "Effective Date"), by and between the Client and the Contractor listed above (collectively, the "Parties").</p>

        <h2>1. Services & Milestones</h2>
        <p>The Contractor agrees to perform the services described in the Milestones table below (the "Services") in a professional and workmanlike manner. The Client agrees to pay the Contractor the total sum of <strong>₹${totalValue}</strong> upon successful completion and verification of these milestones.</p>
        
        <table>
          <thead>
            <tr>
              <th width="5%">#</th>
              <th width="35%">Objective & Deliverables</th>
              <th width="35%">Acceptance Criteria</th>
              <th width="12%">Deadline</th>
              <th width="13%">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${milestoneRows}
          </tbody>
        </table>

        <h2>2. TrustVault Smart Contract Protocol</h2>
        <p><strong>2.1 Escrow Mechanism.</strong> The Parties acknowledge that the funds associated with this Agreement shall be deposited into the TrustVault Smart Contract Escrow. Funds are cryptographically locked and may only be released upon: (a) Client approval of submitted deliverables, or (b) a binding decision by the TrustVault Arbitration Protocol.</p>
        <p><strong>2.2 Evidence Requirement.</strong> The Contractor must upload verifiable digital evidence (files, links, or logs) to the Platform for each Milestone. This evidence serves as the basis for automated verification and dispute resolution.</p>

        <h2>3. Intellectual Property Rights</h2>
        <p><strong>3.1 Work Made for Hire.</strong> Upon the release of funds from Escrow for a specific Milestone, all right, title, and interest in the Deliverables produced for that Milestone shall automatically transfer to the Client. The Contractor hereby assigns to the Client all Intellectual Property Rights related thereto.</p>
        <p><strong>3.2 Pre-existing IP.</strong> Any pre-existing intellectual property owned by the Contractor and incorporated into the Deliverables shall remain the property of the Contractor, and Contractor hereby grants Client a perpetual, non-exclusive, royalty-free license to use such IP as part of the Deliverables.</p>

        <h2>4. Confidentiality</h2>
        <p>The Contractor acknowledges that they may have access to information that is treated as confidential and proprietary by the Client, including trade secrets, technology, and business information ("Confidential Information"). The Contractor agrees to hold such information in strict confidence and not to disclose it to any third party or use it for any purpose other than performing the Services.</p>

        <h2>5. Independent Contractor Status</h2>
        <p>Nothing contained in this Agreement shall create an employer-employee relationship, a master-servant relationship, or a principal-agent relationship between the Parties. The Contractor is an independent service provider and is solely responsible for all taxes, withholdings, and other statutory obligations arising from the compensation received.</p>

        <h2>6. Dispute Resolution</h2>
        <p>In the event of a dispute regarding the quality or completeness of the Services, the Parties agree to submit to the <strong>TrustVault Arbitration Protocol</strong>:</p>
        <ul>
            <li><strong>Level 1:</strong> Automated Analysis. An AI agent will analyze the submitted evidence against the defined Acceptance Criteria.</li>
            <li><strong>Level 2:</strong> Human Arbitration. If contested, a decentralized panel of human jurors will review the case.</li>
        </ul>
        <p>The decision rendered by the Protocol shall be final and binding on both Parties regarding the release or refund of Escrow funds.</p>

        <h2>7. Termination</h2>
        <p>Either Party may terminate this Agreement via the Platform. If terminated by the Client for convenience, the Client shall pay for all work completed and accepted up to the date of termination. If terminated by the Contractor, any unearned funds in Escrow shall be returned to the Client.</p>

        <div class="signatures">
          <div class="sig-block">
            <div class="sig-label">Digitally Signed By Client</div>
            <div class="sig-val">${contract.clientName}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 5px;">Date: ${date}</div>
          </div>
          <div class="sig-block">
            <div class="sig-label">Digitally Signed By Contractor</div>
            <div class="sig-val">${contract.freelancerName}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 5px;">Date: ${date}</div>
          </div>
        </div>

        <div class="hash-block">
          <strong>CRYPTOGRAPHIC EVIDENCE HASH</strong>
          <div class="hash-code">${generateFakeHash(contract.id + totalValue + date)}</div>
          <div style="font-size: 10px; color: #94a3b8; margin-top: 5px;">
            This SHA-256 hash serves as the immutable digital fingerprint of this agreement on the blockchain.
          </div>
        </div>

        <div class="footer">
          Generated via TrustVault Protocol • Page 1 of 1 • System Version 1.0.4
        </div>

        <script>
          window.onload = function() { 
            setTimeout(function() { window.print(); }, 500); 
          }
        </script>
      </body>
    </html>
  `;
};

// Generate a deterministic-looking hash based on input
const generateFakeHash = (input: string) => {
    let hash = '0x';
    const chars = '0123456789abcdef';
    // Simple pseudo-random generation based on input string
    let seed = 0;
    for (let i = 0; i < input.length; i++) {
        seed = (seed + input.charCodeAt(i)) % 1000;
    }
    
    for(let i=0; i<64; i++) {
        const index = (seed + i * 7) % chars.length;
        hash += chars[index];
    }
    return hash;
};

export const downloadContract = (contract: Contract) => {
    const html = generateContractHTML(contract);
    const win = window.open('', '_blank');
    if (win) {
        win.document.write(html);
        win.document.close();
    } else {
        alert("Pop-up blocked. Please allow pop-ups to download the contract PDF.");
    }
};
