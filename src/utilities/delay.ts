export const delaySeconds = (seconds: number) => {
	return new Promise(resolve => {
		setTimeout(() => resolve(''), seconds * 1000);
	});
  }
  