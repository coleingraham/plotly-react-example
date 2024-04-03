import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { Amplify, API } from 'aws-amplify';

const amplifyConfig = {
    API: {
        endpoints: [
            {
                name: 'exampleApi',
                endpoint: 'https://qojy5wzkvc.execute-api.us-east-2.amazonaws.com/prod'
            }
        ]
    }
}

Amplify.configure(amplifyConfig);

async function callApi() {
    const data = await API.get(
        'exampleApi',
        '/nvda')

    return data
}

const App = () => {
    const [data, setData] = useState({x: [], y: []})
    const [revision, setRevision] = useState(0);

    useEffect(() => {
        callApi().then((payload) => {
            let body = JSON.parse(payload.body)
            setData(body)
            setRevision(r => r+1)
        })
    }, [])

    const layout = {
        width: 1500,
        height: 800,
        title: 'NVidia Stock',
        xaxis: {
            type: "date"
        },
        dragmode: "pan",
    };

    const config = {
        displayModeBar: false,
        responsive: true
    };

    return (
        <Plot
            data={[
                {
                    x: data.x,
                    y: data.y,
                    type: 'scatter',
                    mode: 'lines',
                    marker: {color: 'red'},
                }
            ]}
            layout={layout}
            config={config}
            revision = {revision}
        />
    );
}

export default App
