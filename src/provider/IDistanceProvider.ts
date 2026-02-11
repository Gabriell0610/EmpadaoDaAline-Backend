
export interface DistanceResponse {
    rows: [
       {
         elements: [
            {
                distance?: { 
                    text: string, 
                    value: number 
                },
                duration?: { 
                    text: string, 
                    value: number 
                },
                origin: string,
                destination: string,
                status: string
           }
        ]
       }
    ],
    status: string;
    error_message?: string
}
export interface IDistanceProvider {
    getDistance(origin: string, destination: string): Promise<DistanceResponse>
}