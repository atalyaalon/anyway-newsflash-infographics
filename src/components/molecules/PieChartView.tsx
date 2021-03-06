import React, { FC } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, PieLabelRenderProps } from 'recharts';
import { fontFamilyString } from '../../style';

interface IProps {
  data: Array<object>;
  xLabel: string;
  yLabel: string;
  innerRadius?: string;
  usePercent?: boolean;
}
// hardcoded colors, will be changed
const COLORS = ['#b71c1c', '#e53935', '#d90000', '#890505', '#6a6a6a'];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = (props: any, usePercent = false) => {
  const { cx, cy, midAngle, innerRadius, percent, outerRadius, value, name } = props;
  const labelText = usePercent ? `${Math.round(percent * 100)}%` : value;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const xCountLabel = cx + radius * Math.cos(-midAngle * RADIAN);
  const yCountLabel = cy + radius * Math.sin(-midAngle * RADIAN);
  const sin = Math.sin(-RADIAN * midAngle); // if sin >= 0 label is on top half
  const cos = Math.cos(-RADIAN * midAngle); // if cos >= 0 label is on right half
  // const sx = cx + outerRadius * cos;
  // const sy = cy + outerRadius * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? -1 : -1.5) * 25;
  const ey = my + (sin >= 0 ? -2 : -1) * 10;

  const textLabelStyle = {
    fontFamily: fontFamilyString,
    fontWeight: 700,
    fontSize: 14,
    textAlign: 'center' as 'center',
  };

  return (
    <g>
      <text
        x={xCountLabel}
        y={yCountLabel}
        fill="black"
        textAnchor={xCountLabel > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontFamily={fontFamilyString}
      >
        {labelText}
      </text>
      {/* for text wrapping in svg - use foreignObject
      make sure to give foreignObject height and width, or inner element will not be displayed
      https://stackoverflow.com/questions/4991171/auto-line-wrapping-in-svg-text */}
      <foreignObject fontFamily={fontFamilyString} fontWeight={700} fontSize={14} x={ex} y={ey} height={76} width={60}>
        <div style={textLabelStyle}>{name}</div>
      </foreignObject>
    </g>
  );
};

const renderLabelCount = (props: PieLabelRenderProps) => renderCustomizedLabel(props);
const renderLabelPercent = (props: PieLabelRenderProps) => renderCustomizedLabel(props, true);

export const PieChartView: FC<IProps> = ({ data, yLabel, xLabel, innerRadius, usePercent }) => {
  const labelFn = usePercent ? renderLabelPercent : renderLabelCount;
  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      <PieChart>
        <Pie
          data={data}
          dataKey={yLabel}
          nameKey={xLabel}
          outerRadius={'60%'}
          innerRadius={innerRadius}
          minAngle={15}
          label={labelFn}
          labelLine={false}
        >
          {data.map((entry: any, index: any) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};
export default PieChartView;
