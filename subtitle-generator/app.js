import fs from 'fs/promises'

const subtitle = await fs.readFile('./subtitle-input.txt', 'utf-8')

const subtitleLines = subtitle
  .split('\n')
  .filter((line) => line.includes(' - '))

function formatInSubtitleTime(timeInMilliseconds) {
  const timeObj = new Date(timeInMilliseconds)
  const hours = timeObj.getUTCHours().toString().padStart(2, '0')
  const minutes = timeObj.getUTCMinutes().toString().padStart(2, '0')
  const seconds = timeObj.getUTCSeconds().toString().padStart(2, '0')
  const milliseconds = timeObj.getUTCMilliseconds().toString().padStart(3, '0')
  return `${hours}:${minutes}:${seconds},${milliseconds}`
}

const formattedData = subtitleLines.map((line) => {
  const [time, sentence] = line.split('  ')
  const [startTime, endTime] = time.split(' - ')
  const formattedStartTime = formatInSubtitleTime(startTime * 1000)
  const formattedEndTime = formatInSubtitleTime(endTime * 1000)

  return { formattedStartTime, formattedEndTime, sentence }
})

const commandFileHandler = await fs.open('./subtitle-output.srt', 'w')

for await (const [i, value] of formattedData.entries()) {
  const { formattedStartTime, formattedEndTime, sentence } = value
  await commandFileHandler.write(
    `${i + 1}\n${formattedStartTime} --> ${formattedEndTime}\n${sentence}\n\n`
  )
}
