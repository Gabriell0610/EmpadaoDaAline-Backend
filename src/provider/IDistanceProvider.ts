
export interface DistanceRespost {
    distance: { 
        text: string, 
        value: number 
    },
    duration: { 
        text: string, 
        value: number 
    },
    origin: string,
    destination: string,
    status: string
}
export interface IDistanceProvider {
    getDistance(origin: string, destination: string): Promise<DistanceRespost>
}