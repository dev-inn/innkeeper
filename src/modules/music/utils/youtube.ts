import ytsr, { Video } from 'ytsr'

const insaneRegexString =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/

/**Gets the valid youtube url from either a search term or url
 * @param arg either a valid youtube url or a search term to find a video for
 * @returns a valid youtube video url
 */
export async function getYoutubeUrlFromVideoArg(arg: string): Promise<string> {
  // tests if input was a url
  const regMatch = arg.match(insaneRegexString)
  if (regMatch) {
    return regMatch[0]
  } else {
    // Creates filter url to filter out results that aren't videos
    const filters1 = await ytsr.getFilters(arg)
    const filter1 = filters1.get('Type')?.get('Video')
    if (!filter1?.url) {
      throw new Error('Could not find any results ;(')
    }

    const results = await ytsr(filter1.url, { limit: 1 })
    const item = <Video>results.items[0]
    return item.url
  }
}
