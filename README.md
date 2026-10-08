# 📊 EGE Tracker

> Веб-приложение для аналитики, трекинга и объективной оценки уровня подготовки к ЕГЭ.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Redux Toolkit](https://img.shields.io/badge/Redux--Toolkit-764ABC?logo=redux)
![TypeScript](https://img.shields.io/badge/TypeScript-In_Progress-3178C6?logo=typescript)
![Django REST Framework](https://img.shields.io/badge/Django_REST-092E20?logo=django)
![Figma](https://img.shields.io/badge/Figma-Design-F24E1E?logo=figma)

---

## 🎯 Проблема и решение

**Проблема:** При подготовке к ЕГЭ школьники часто не понимают свой реальный уровень знаний, теряются в объеме материала и не знают, какие задания нужно повторить в первую очередь.

**Решение:** EGE Tracker помогает структурировать подготовку. Сервис позволяет фиксировать изученные темы и результаты вариантов (пробников), автоматически рассчитывая процент освоения каждого задания и предмета в целом.

---

## 🎨 Дизайн и UI/UX

Интерфейс приложения полностью спроектирован с нуля в Figma перед разработкой.

👉 [**Посмотреть макет проекта в Figma**](https://www.figma.com/design/cjr0KJisC2V6I7CyXgpoh6/Untitled?node-id=0-1&t=oXTq54weY7dtRRAG-1)

---

## 🖼 Скриншоты интерфейса

| Главная страница / Аналитика | Модальные окна / Пробники |
|:---:|:---:|
| ![Dashboard](./assets/dashboard.png) | ![Analytics](./assets/analytics.png) |

---

## ✨ Основной функционал

- 📈 **Динамическая статистика:** Автоматический перерасчет уровня владения предметом на основе результатов пробников.
- 🎯 **Анализ проблемных зон:** Наглядное отображение слабых тем, требующих повторения.
- 📝 **Трекинг заданий:** Фиксация изученного материала и отдельных типов задач.
- 📊 **Визуализация прогресса:** Интерактивные графики и чарты (Recharts).

---

## 🛠 Технологический стек

### Frontend
- **Core:** React 19, Vite
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Routing:** React Router v7
- **UI & Charts:** Recharts, React Circular Progressbar
- **Styles:** SCSS (SASS), CLSX
- **HTTP Client:** Axios
- **Language:** JavaScript (процесс миграции на TypeScript 🔄)

### Backend
- **Core:** Python, Django
- **API:** Django REST Framework (DRF)
- **Database:** PostgreSQL / SQLite (Local)
