const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    console.log('Request to /clicks:', req.method, req.url, req.headers.origin);
    res.setHeader('Access-Control-Allow-Origin', 'https://anotherimm.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        console.log('Handling OPTIONS for /clicks');
        return res.status(200).end();
    }

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
};