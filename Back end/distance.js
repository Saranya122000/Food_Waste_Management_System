function distance(lat1,lat2, lon1, lon2)
{       // The math module contains a function
        // named toRadians which converts from
        // degrees to radians.
        lon1 =  lon1 * Math.PI / 180;
        lon2 = lon2 * Math.PI / 180;
        lat1 = lat1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;
        // Haversine formula 
        let dlon = lon2 - lon1; 
        let dlat = lat2 - lat1;
        let a = Math.pow(Math.sin(dlat / 2), 2)
                 + Math.cos(lat1) * Math.cos(lat2)
                 * Math.pow(Math.sin(dlon / 2),2);
        let c = 2 * Math.asin(Math.sqrt(a));
        // Radius of earth in kilometers. Use 3956 
        // for miles
        let r = 6371;
        // calculate the result
        return(c * r);
    }
// Driver code    
   let lat1 = 11.0219613
   let lon1 = 76.9960919
    let lat2 = 11.04984
        let lon2 = 76.918862
        console.log(distance(lat1, lat2,lon1, lon2) + " K.M");