 // import { Cascader } from 'antd';
 const Cascader = antd.Cascader
 console.log(Cascader)
 let mountNode = document.getElementById('container')

 const options = [
     {
         value: 1,// id 值
         label: 'Zhejiang',  // 菜单名称
         children: [ // 子集
             {
                 value: 2, 
                 label: 'Hangzhou',
                 children: [
                     {
                         value: 'xihu',
                         label: 'West Lake',
                     },
                 ],
             },
         ],
         count: 11,
     },
     {
         value: 4,
         label: 'Jiangsu',
         children: [
             {
                 value:54,
                 label: 'Nanjing',
                 children: [
                     {
                         value: 'zhonghuamen',
                         label: 'Zhong Hua Men',
                     },
                 ],
             },
         ],
     },
 ];

 function onChange(value) {
     console.log(value);
 }

 ReactDOM.render(
     <Cascader
         defaultValue={['zhejiang', 'hangzhou', 'xihu']}
         options={options}
         changeOnSelect
         expandTrigger='hover'
         onChange={onChange}/>,
     mountNode);