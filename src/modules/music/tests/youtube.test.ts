import { getVideoObjFromYTVideoArg } from '../utils/youtube'

test('Find video by url', async () => {
  expect.assertions(1)
  const video = await getVideoObjFromYTVideoArg('https://www.youtube.com/watch?v=jNQXAC9IVRw')
  expect(video.title).toBe('Me at the zoo')
})

test('Find video by search', async () => {
  expect.assertions(1)
  const video = await getVideoObjFromYTVideoArg('Me at the zoo')
  expect(video.url).toBe('https://www.youtube.com/watch?v=jNQXAC9IVRw')
})
