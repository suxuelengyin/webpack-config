import './index.scss'
import DistPicker from '@/components/distpicker'
import testjpg from './test.jpg'
document.getElementById('test').addEventListener('click', (e) => {
    new DistPicker({
        nameKey: "name", //返回对象指定的键名
        dataEventsList: [
            () => {
                return [2, 2, 23, 22, 2, 23, 2, 22, 22, 22,]
            },
            (val, data) => {
                console.log(data)
                console.log(val)
            }
        ]
    })
})
console.log(testjpg)