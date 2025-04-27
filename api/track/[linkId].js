const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    console.log('Request to /track:', req.method, req.url, req.query, req.headers.origin);
    res.setHeader('Access-Control-Allow-Origin', 'https://anotherimm.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        console.log('Handling OPTIONS for /track');
        return res.status(200).end();
    }

    const { linkId } = req.query;

    const { data, error } = await supabase
        .from('links')
        .select('destination')
        .eq('link_id', linkId)
        .single();

    if (error || !data) {
        console.error('Supabase error:', error);
        return res.status(404).json({ error: 'Link tidak ditemukan' });
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    let geoData = { country: 'Tidak diketahui', city: 'Tidak diketahui' };

    try {
        const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
        const geo = await geoResponse.json();
        if (!geo.error) {
            geoData = {
                country: geo.country_name || 'Tidak diketahui',
                city: geo.city || 'Tidak diketahui'
            };
        }
    } catch (e) {
        console.error('Geolocation error:', e);
    }

    await supabase.from('clicks').insert([{
        link_id: linkId,
        ip,
        country: geoData.country,
        city: geoData.city,
        timestamp: new Date().toISOString()
    }]);

    console.log('Redirecting to:', data.destination);
    res.redirect(data.destination);
};