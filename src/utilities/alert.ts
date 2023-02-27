export const soundAlert = async () => {
	// https://stackoverflow.com/questions/8557624/how-i-trigger-the-system-bell-in-nodejs
	process.stdout.write('\u0007');
}