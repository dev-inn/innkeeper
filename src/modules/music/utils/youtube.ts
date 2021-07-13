import ytsr, { Video } from 'ytsr'

const insaneRegexString =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/

/**Gets the video object from either a search term or url
 * @param arg either a valid youtube url or a search term to find a video for
 * @returns ytsr video object
 */
export async function getVideoObjFromYTVideoArg(arg: string): Promise<Video> {
  let url
  // tests if input was a url
  const regMatch = arg.match(insaneRegexString)
  if (regMatch) {
    url = regMatch[0]
  } else {
    // Creates filter url to filter out results that aren't videos
    const filters1 = await ytsr.getFilters(arg)
    const filter1 = filters1.get('Type')?.get('Video')
    if (!filter1?.url) {
      throw new Error('Could not find any results ;(')
    }
    url = filter1.url
  }
  const results = await ytsr(url, { limit: 1 })
  if (results.items.length == 0) {
    throw new Error('Could not find any results ;(')
  }
  const item = <Video>results.items[0]
  return item
}
