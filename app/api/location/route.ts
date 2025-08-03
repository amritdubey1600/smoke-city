import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    const { searchParams } = new URL(req.url); 
    const city = searchParams.get('city');

    if(!city) return NextResponse.json({error: 'Missing city in params'}, {status: 400});
    
    try {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&appid=${process.env.API_KEY}`);
        if(!response.ok) return NextResponse.json({error: 'Cant fetch Openweather API data'}, {status: 400});
        
        const json = await response.json();
        return NextResponse.json({lat: json[0].lat, lon: json[0].lon}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'Something went wrong', details: String(error)}, {status: 400});
    }
}