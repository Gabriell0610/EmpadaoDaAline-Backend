import { IDistanceProvider } from "./IDistanceProvider";


export class DistanceProvider implements IDistanceProvider {

    private API_KEY = process.env.KEY_DISTANCEMATRIX

    getDistance = async (origin: string, destination: string) =>  {
        const url = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${this.API_KEY}`;
        
        const req = await fetch(url)

        const res = await req.json()
        console.log("Response provider", res.rows[0].elements[0])
        console.log("Response provider", res.rows[0].elements[0].distance.value)

        return res.rows[0].elements[0]
    }
    
}