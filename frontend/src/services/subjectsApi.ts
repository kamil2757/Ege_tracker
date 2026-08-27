import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const subjectsApi = createApi({
  reducerPath: 'subjectsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.access; 
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Subjects', 'Subject'],

  endpoints: (builder) => ({
    // 1. Получение всех предметов
    getSubjects: builder.query({
      query: () => 'subjects/mySubjects/',
      providesTags: ['Subjects'], // Этот запрос "предоставляет" данные под тегом Subjects
    }),

    // 2. Получение одного предмета
    getSubject: builder.query({
      query: (id) => `subjects/getSubject/${id}`,
      providesTags: (result, error, id) => [{ type: 'Subject', id }],
    }),

    // 3. Обновление задачи (Mutation)
    updateTask: builder.mutation({
      query: ({ taskId }) => ({
        url: 'tasks/review/',
        method: 'POST',
        body: { task_id: taskId },
      }),
      // Когда мы обновили задачу, мы говорим: "Данные о предметах и конкретном предмете устарели!"
      // RTK Query сама перевыполнит getSubjects и getSubject
      invalidatesTags: (result, error, { taskId }) => ['Subjects', 'Subject'],
    }),
  }),
});


export const { 
  useGetSubjectsQuery, 
  useGetSubjectQuery, 
  useUpdateTaskMutation 
} = subjectsApi;