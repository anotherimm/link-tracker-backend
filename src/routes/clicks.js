const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.get('/', async (req, res) => {
    console.log('Request to /clicks:', req.method, req.url);
    const { data, error } = await supabase
        .from('clicks')
        .select('*')
        .order('timestamp', { ascending: false });

    if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: 'Gagal mengambil data klik' });
    }

    console.log('Returning clicks data:', data.length);
    res.status(200).json(data);
});

module.exports = router;