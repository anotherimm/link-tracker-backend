const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.get('/:linkId', async (req, res) => {
    console.log('Request to /track:', req.method, req.url, req.params);
    const { linkId } = req.params;

    const { data, error } = await supabase
        .from('links')
        .select('destination')
        .eq('link_id', linkId)
        .single();

    if (error || !data) {
        console.error('Supabase error:', error);
        return res.status(404).json({ error: 'Link tidak ditemukan' });
    }

    const ip = req.headers['x-forwarded-for'] || req.ip;
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
});

module.exports = router;