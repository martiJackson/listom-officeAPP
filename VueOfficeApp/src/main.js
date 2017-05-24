// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'
import VueRouter from "vue-router"
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'

import index from './components/index'
import leave from './components/leave'
import machine from './components/machine'
import notice from './components/notice'
import order from './components/order'
import overtime from './components/overtime'
import records from './components/records'
import shifubao_agreement from './components/shifubao_agreement'
import statistics from './components/statistics'
import userAgrement from './components/userAgrement'
import workshop from './components/workshop'
import all_machines_statistics from './components/machine/all_machines_statistics'
import calculate from './components/machine/calculate'
import machine_alert_detail from './components/machine/machine_alert_detail'
import machine_alert_records from './components/machine/machine_alert_records'
import machine_detail from './components/machine/machine_detail'
import machine_task from './components/machine/machine_task'
import single_machine_statistics from './components/machine/single_machine_statistics'
import single_machine_statistics_month from './components/machine/single_machine_statistics_month'
import single_machine_timeline_statistics from './components/machine/single_machine_timeline_statistics'
import login from './components/maintenance/login'
import machine_maintenance_add from './components/maintenance/machine_maintenance_add'
import machine_maintenance_list from './components/maintenance/machine_maintenance_list'
import machine_maintenance_records from './components/maintenance/machine_maintenance_records'
import main from './components/maintenance/main'
import main2 from './components/maintenance/main2'
import single_machine_maintenance_detail from './components/maintenance/single_machine_maintenance_detail'
import single_machine_maintenance_detail_admin from './components/maintenance/single_machine_maintenance_detail_admin'
import statistics_boss_attendance from './components/statistics/statistics_boss_attendance'
import statistics_boss_late_top from './components/statistics/statistics_boss_late_top'
import statistics_boss_leave from './components/statistics/statistics_boss_leave'
import statistics_boss_machine from './components/statistics/statistics_boss_machine'
import statistics_boss_overtime from './components/statistics/statistics_boss_overtime'
import statistics_boss_overtime_top from './components/statistics/statistics_boss_overtime_top'
import statistics_boss_salary from './components/statistics/statistics_boss_salary'
import statistics_employee_attendance from './components/statistics/statistics_employee_attendance'
import statistics_employee_leave from './components/statistics/statistics_employee_leave'
import statistics_employee_overtime from './components/statistics/statistics_employee_overtime'
import statistics_workshop_detail from './components/statistics/statistics_workshop_detail'
import statistics_workshop_list from './components/statistics/statistics_workshop_list'
import machine_running_status from './components/status/machine_running_status'
import machine_working_history from './components/status/machine_working_history'
import machine_working_status from './components/status/machine_working_status'

Vue.use(VueAwesomeSwiper)
Vue.use(VueRouter)
Vue.use(ElementUI)
const routes = [  
  { path: '/', component:index} 
  ,{ path: '/leave', component:leave} 
  ,{ path: '/machine', component:machine} 
  ,{ path: '/notice', component:notice}
  ,{ path: '/order', component:order} 
  ,{ path: '/overtime', component:overtime} 
  ,{ path: '/records', component:records} 
  ,{ path: '/shifubao_agreement', component:shifubao_agreement} 
  ,{ path: '/statistics', component:statistics} 
  ,{ path: '/userAgrement', component:userAgrement} 
  ,{ path: '/workshop', component:workshop} 
  ,{ path: '/all_machines_statistics', component:all_machines_statistics} 
  ,{ path: '/calculate', component:calculate} 
  ,{ path: '/machine_alert_detail', component:machine_alert_detail}
  ,{ path: '/machine_alert_records', component:machine_alert_records} 
  ,{ path: '/machine_detail', component:machine_detail} 
  ,{ path: '/machine_task', component:machine_task} 
  ,{ path: '/single_machine_statistics', component:single_machine_statistics} 
  ,{ path: '/single_machine_statistics_month', component:single_machine_statistics_month} 
  ,{ path: '/single_machine_timeline_statistics', component:single_machine_timeline_statistics}
  ,{path:'/login',component:login} 
  ,{ path: '/machine_maintenance_add', component:machine_maintenance_add} 
  ,{ path: '/machine_maintenance_list', component:machine_maintenance_list} 
  ,{ path: '/machine_maintenance_records', component:machine_maintenance_records} 
  ,{ path: '/main', component:main} 
  ,{ path: '/main2', component:main2} 
  ,{ path: '/single_machine_maintenance_detail', component:single_machine_maintenance_detail} 
  ,{ path: '/single_machine_maintenance_detail_admin', component:single_machine_maintenance_detail_admin} 
  ,{ path: '/statistics_boss_attendance', component:statistics_boss_attendance} 
  ,{ path: '/statistics_boss_late_top', component:statistics_boss_late_top}
  ,{ path: '/statistics_boss_leave', component:statistics_boss_leave}
  ,{ path: '/statistics_boss_machine', component:statistics_boss_machine}
  ,{ path: '/statistics_boss_overtime', component:statistics_boss_overtime}
  ,{ path: '/statistics_boss_overtime_top', component:statistics_boss_overtime_top} 
  ,{ path: '/statistics_boss_salary', component:statistics_boss_salary} 
  ,{ path: '/statistics_employee_attendance', component:statistics_employee_attendance} 
  ,{ path: '/statistics_employee_leave', component:statistics_employee_leave} 
  ,{ path: '/statistics_employee_overtime', component:statistics_employee_overtime} 
  ,{ path: '/statistics_workshop_detail', component:statistics_workshop_detail} 
  ,{ path: '/statistics_workshop_list', component:statistics_workshop_list} 
  ,{ path: '/machine_running_status', component:machine_running_status} 
  ,{ path: '/machine_working_history', component:machine_working_history} 
  ,{ path: '/machine_working_status', component:machine_working_status}
]
const data = new VueRouter({
  routes
})

new Vue({
  el: '#app',
  router:data,
  template: '<App/>',
  components: { App },
})
