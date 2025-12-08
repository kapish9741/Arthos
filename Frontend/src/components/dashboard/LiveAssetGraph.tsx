import { useState, useEffect } from 'react';
import { AreaChart, Area, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const LiveAssetGraph = ({ currentValue = 5000, historicalData = [] }: { currentValue?: number, historicalData?: any[] }) => {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        if (historicalData && historicalData.length > 0) {
            setData(historicalData);
        } else {
            const initialData = [];
            let baseValue = currentValue;
            for (let i = 0; i < 20; i++) {
                baseValue = baseValue + (Math.random() - 0.5) * (currentValue * 0.05);
                initialData.push({
                    time: i,
                    value: Math.max(0, baseValue)
                });
            }
            setData(initialData);
        }
    }, [historicalData, currentValue]);

    useEffect(() => {
        if (historicalData && historicalData.length > 0) return;

        const interval = setInterval(() => {
            setData(prevData => {
                if (prevData.length === 0) return prevData;
                const lastValue = prevData[prevData.length - 1].value;
                const fluctuation = (Math.random() - 0.5) * (currentValue * 0.02);
                const newValue = Math.max(0, lastValue + fluctuation);
                const newTime = prevData[prevData.length - 1].time + 1;

                const newData = [...prevData.slice(1), { time: newTime, value: newValue }];
                return newData;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [currentValue, historicalData]);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg shadow-xl">
                    <p className="text-neutral-400 text-xs mb-1">Asset Value</p>
                    <p className="text-white font-bold text-lg">
                        ${payload[0].value.toFixed(2)}
                    </p>
                    {payload[0].payload.time > 1000 && (
                        <p className="text-neutral-500 text-[10px] mt-1">
                            {new Date(payload[0].payload.time * 1000).toLocaleTimeString()}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-full relative">
            <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 bg-neutral-900/50 backdrop-blur-md px-3 py-1 rounded-full border border-green-500/30">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-green-500 text-xs font-medium">LIVE</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 0,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.3} />
                    <YAxis
                        domain={['auto', 'auto']}
                        orientation="right"
                        tick={{ fill: '#666', fontSize: 10 }}
                        tickFormatter={(value) => `$${value.toFixed(0)}`}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        isAnimationActive={true}
                        animationDuration={1000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LiveAssetGraph;
