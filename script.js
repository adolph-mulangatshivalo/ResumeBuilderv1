document.addEventListener('DOMContentLoaded', () => {
    // Collect DOM Elements
    const inputs = {
        name: document.getElementById('input-name'),
        title: document.getElementById('input-title'),
        email: document.getElementById('input-email'),
        phone: document.getElementById('input-phone'),
        location: document.getElementById('input-location'),
        website: document.getElementById('input-website'),
        summary: document.getElementById('input-summary'),
        experience: document.getElementById('input-experience'),
        education: document.getElementById('input-education'),
        skills: document.getElementById('input-skills')
    };

    const previews = {
        name: document.getElementById('preview-name'),
        title: document.getElementById('preview-title'),
        email: document.getElementById('preview-email'),
        phone: document.getElementById('preview-phone'),
        location: document.getElementById('preview-location'),
        website: document.getElementById('preview-website'),
        websiteContainer: document.getElementById('preview-website-container'),
        summary: document.getElementById('preview-summary'),
        experience: document.getElementById('preview-experience'),
        education: document.getElementById('preview-education'),
        skills: document.getElementById('preview-skills')
    };

    // Configuration Selectors
    const selectors = {
        layout: document.getElementById('layout-selector'),
        color: document.getElementById('color-selector'),
        font: document.getElementById('font-selector')
    };

    const resumePreview = document.getElementById('resume-preview');

    // Handle class updates based on selectors
    const updateClasses = () => {
        resumePreview.className = `resume-preview ${selectors.layout.value} ${selectors.color.value} ${selectors.font.value}`;
    };

    Object.values(selectors).forEach(sel => sel.addEventListener('change', updateClasses));

    // Advanced Textarea Parser
    const parseTextareaAdvanced = (val, defaultHtml) => {
        if (!val.trim()) return defaultHtml;
        
        const lines = val.split('\n');
        let html = '';
        let inList = false;

        lines.forEach((line) => {
            const trimmed = line.trim();
            if (trimmed === '') return;

            // List item detection
            if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
                if (!inList) { html += '<ul>'; inList = true; }
                html += `<li>${trimmed.substring(1).trim()}</li>`;
            } else {
                if (inList) { html += '</ul>'; inList = false; }
                
                // Assume non-bullet lines are Headers (e.g. Job titles or Degrees)
                // We format them into structured div "items"
                let titleParts = trimmed.split('(');
                let mainTitle = titleParts[0].trim();
                let datePart = titleParts.length > 1 ? '(' + titleParts[1] : '';

                let innerParts = mainTitle.split('-');
                let position = innerParts[0] ? innerParts[0].trim() : '';
                let company = innerParts[1] ? innerParts[1].trim() : '';

                html += `<div class="item">
                            <p><strong>${position}</strong>${company ? ' - ' + company : ''} <span style="float:right; opacity:0.8; font-size: 0.9em;">${datePart.replace(/[()]/g, '')}</span></p>
                         </div>`;
            }
        });
        
        if (inList) html += '</ul>';
        return html;
    };

    // Update real-time preview
    const updatePreview = () => {
        previews.name.textContent = inputs.name.value.trim() || 'John Doe';
        previews.title.textContent = inputs.title.value.trim() || 'Software Engineer';
        previews.email.textContent = inputs.email.value.trim() || 'john@example.com';
        previews.phone.textContent = inputs.phone.value.trim() || '(555) 123-4567';
        previews.location.textContent = inputs.location.value.trim() || 'New York, NY';
        
        if (inputs.website.value.trim()) {
            previews.website.textContent = inputs.website.value.trim();
            previews.websiteContainer.style.display = 'inline-flex';
        } else {
            previews.websiteContainer.style.display = 'none';
        }

        previews.summary.textContent = inputs.summary.value.trim() || 'Creative and detail-oriented Software Engineer with over 5 years of experience in developing user-centric web applications. Proven ability to leverage state-of-the-art technologies to optimize performance and elevate user engagement.';

        // Experience Parser
        const expDefault = `
            <div class="item">
                <p><strong>Senior Developer</strong> - Tech Corp <span style="float:right; opacity:0.8; font-size: 0.9em;">2020-Present</span></p>
            </div>
            <ul>
                <li>Led development of core products and features.</li>
                <li>Mentored junior developers and conducted code reviews.</li>
                <li>Improved application performance by 40%.</li>
            </ul>
            <div class="item">
                <p><strong>Junior Developer</strong> - StartUp Inc <span style="float:right; opacity:0.8; font-size: 0.9em;">2018-2020</span></p>
            </div>
            <ul>
                <li>Built responsive web interfaces using React.</li>
                <li>Collaborated closely with UX/UI designers.</li>
            </ul>
        `;
        previews.experience.innerHTML = parseTextareaAdvanced(inputs.experience.value, expDefault);

        // Education Parser
        const eduDefault = `
            <div class="item">
                <p><strong>B.S. in Computer Science</strong> - State University <span style="float:right; opacity:0.8; font-size: 0.9em;">2014-2018</span></p>
            </div>
            <ul>
                <li>Graduated Cum Laude</li>
                <li>President of Computer Club</li>
            </ul>
        `;
        previews.education.innerHTML = parseTextareaAdvanced(inputs.education.value, eduDefault);

        // Skills logic
        const skillsVal = inputs.skills.value;
        if (skillsVal.trim()) {
            const skillsArr = skillsVal.split(',').map(s => s.trim()).filter(s => s);
            previews.skills.innerHTML = skillsArr.map(s => `<span>${s}</span>`).join('');
        } else {
            previews.skills.innerHTML = '<span>HTML</span><span>CSS</span><span>JavaScript</span><span>React</span><span>Node.js</span><span>Python</span><span>SQL</span><span>Agile</span>';
        }
    };

    // Attach listeners to update dynamically
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // Initial population
    updatePreview();
    updateClasses();

    // Export to PDF using html2pdf
    document.getElementById('download-btn').addEventListener('click', () => {
        const element = document.getElementById('resume-preview');
        
        const opt = {
            margin:       0,
            filename:     `${inputs.name.value.trim().replace(/\s+/g, '_') || 'Resume'}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, letterRendering: true, logging: false },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    });
});
