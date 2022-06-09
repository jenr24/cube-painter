import interp from 'interpolate-arrays';

export type MapColor = [number, number, number];

export class ColorMap {
    data: MapColor[];

    constructor(data: MapColor[]) {
        this.data = data
    }

    AddColors(min: number, max: number, n: number): MapColor {
        if(n<min) n = min;
        if(n>max) n = max;
        if(min == max) return [0,0,0];
        const xn = (n-min)/(max-min);
        return interp(this.data, xn) as MapColor;
    }
}

export const HSV = new ColorMap(
    [ [1,       0,      0   ]
    , [1,       0.5,    0   ]
    , [0.97,    1,      0.01]
    , [0,       0.99,   0.04]
    , [0,       0.98,   0.52]
    , [0,       0.98,   1   ]  
    , [0.01,    0.49,   1   ]
    , [0.03,    0,      0.99]
    , [1,       0,      0.96]
    , [1,       0,      0.49]
    , [1,       0,      0.02]
    ]
);

export const HOT = new ColorMap(
    [ [0,       0,      0   ]
    , [0.3,     0,      0   ]
    , [0.6,     0,      0   ]
    , [0.9,     0,      0   ]
    , [0.93,    0.27,   0   ]
    , [0.97,    0.55,   0   ]
    , [1,       0.82,   0   ]
    , [1,       0.87,   0.25]
    , [1,       0.91,   0.5 ]
    , [1,       0.96,   0.75]
    , [1,       1,      1   ]
    ]
);

export const COOL = new ColorMap(
    [ [0.49,    0,      0.7 ]
    , [0.45,    0,      0.85]
    , [0.42,    0.15,   0.89]
    , [0.38,    0.29,   0.93]
    , [0.27,    0.57,   0.91]
    , [0,       0.8,    0.77]
    , [0,       0.97,   0.57]
    , [0,       0.98,   0.46]
    , [0,       1,      0.35]
    , [0.16,    1,      0.03]
    , [0.58,    1,      0   ]
    ]
);