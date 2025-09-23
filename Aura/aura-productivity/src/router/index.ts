import type { RouteRecordRaw } from 'vue-router'
import Notes from '@/views/Notes.vue'
import Todo from '@/views/Todo.vue'
import Chat from '@/views/Chat.vue'
import Pomodoro from '@/views/Pomodoro.vue'
import Projects from '@/views/Projects.vue'
import Calendar from '@/views/Calendar.vue'
import Alarm from '@/views/Alarm.vue'
import WaterReminder from '../views/WaterReminder.vue'


const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/notes'
  },
  {
    path: '/notes',
    name: 'Notes',
    component: Notes,
    meta: {
      title: '记事',
      icon: 'Notebook'
    }
  },
  {
    path: '/todo',
    name: 'Todo',
    component: Todo,
    meta: {
      title: '待办',
      icon: 'CheckSquare'
    }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
    meta: {
      title: 'AI对话',
      icon: 'MessageCircle'
    }
  },
  {
    path: '/pomodoro',
    name: 'Pomodoro',
    component: Pomodoro,
    meta: {
      title: '番茄钟',
      icon: 'Timer'
    }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
    meta: {
      title: '项目管理',
      icon: 'Briefcase'
    }
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar,
    meta: {
      title: '日历',
      icon: 'Calendar'
    }
  },
  {
    path: '/alarm',
    name: 'Alarm',
    component: Alarm,
    meta: {
      title: '闹钟',
      icon: 'Clock'
    }
  },
  {
    path: '/water',
    name: 'WaterReminder',
    component: WaterReminder,
    meta: {
      title: '科学喝水',
      icon: 'Droplets'
    }
  }
]

export default routes