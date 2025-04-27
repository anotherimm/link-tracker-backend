const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    console.log('Request to /create:', req.method, req.url, req.headers.origin);
    res.setHeader('Access-Control-Allow-Origin', 'https://anotherimm.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        console.log('Handling OPTIONS for /create');
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        console.log('Method not allowed:', req.method);
        return res.status(405).json({ error: 'Metode tidak diizinkan' });
    }

    const { destination } = req.body;
    if (!destination || !isValidUrl(destination)) {
        console.log('Invalid URL:', destination);
        return res.status(400).json({ error: 'URL tujuan tidak valid' });
    }

    const linkId = uuidv4();
    const { error } = await supabase
        .from('links')
        .insert([{ link_id: linkId, destination }]);

    if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: 'Gagal membuat link' });
    }

    console.log('Link created:', linkId);
    res.status(200).json({ linkId });
};

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}