const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.post('/', async (req, res) => {
    console.log('Request to /create:', req.method, req.url, req.body);
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
});

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

module.exports = router;