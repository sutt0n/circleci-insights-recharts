import './App.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import deploymentStats from './data/deployment-data.json'
import buildStats from './data/build-data.json'

function App() {
  return (
    <div className="App">
      <header>CircleCI Insights</header>
      <div className="insights">
        <h2 className="padding-top-0">Deployment Stats</h2>
        <LineChart
          width={1500}
          height={500}
          data={deploymentStats}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis reversed dataKey="name" dy={5} minTickGap={75}/>
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="credits_used" stroke="#8884d8" dy={30} />
          <Line type="monotone" dataKey="duration" stroke="#82ca9d" dy={30} activeDot={{ r: 3 }} />
        </LineChart>
      </div>
      <div className="insights">
        <h2 className="padding-top-0">Build Stats</h2>
        <LineChart
          width={1500}
          height={500}
          data={buildStats}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis reversed dataKey="name" dy={5} minTickGap={75}/>
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="credits_used" stroke="#8884d8" dy={30} />
          <Line type="monotone" dataKey="duration" stroke="#82ca9d" dy={30} activeDot={{ r: 3 }} />
        </LineChart>
      </div>
    </div>
  );
}

export default App;
