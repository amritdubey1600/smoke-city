import { NextRequest, NextResponse } from "next/server";
import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });

redis.on('error', (err) => console.log(err));

async function startRedis() {
    if(!redis.isOpen) await redis.connect();
}

startRedis();

export async function GET(req: NextRequest){
    const { searchParams } = new URL(req.url);

    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if(!lat || !lon) return NextResponse.json({error: 'Lat/Lon missing'}, {status: 400});

    const cachedKey = `lat=${lat}lon=${lon}`;

    try {
        const canchedVal = await redis.get(cachedKey);

        if(canchedVal) return NextResponse.json(JSON.parse(canchedVal), {status: 200});

        const response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}`)
        if(!response.ok) return NextResponse.json({error: 'Couldnt fetch pollution data'}, {status: 400});

        const json = await response.json();
        const data = {
            aqi: json.list[0].main.aqi,
            pm2_5: json.list[0].components.pm2_5
        };

        await redis.setEx(cachedKey, 600, JSON.stringify(data));

        return NextResponse.json(data, {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'Something went wrong', details: String(error)}, {status: 400});
    }
}