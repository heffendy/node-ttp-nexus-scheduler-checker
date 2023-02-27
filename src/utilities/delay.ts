export const delaySeconds = async (seconds: number): Promise<void> => {
  await new Promise(resolve => {
    setTimeout(() => { resolve('') }, seconds * 1000)
  })
}
