import got from 'got'

// Call web service and return total vehicles, (got is library to call url)
async function getTotalVehicles() {
	return await got.get('https://my-webservice.moveecar.com/vehicles/total');
}
async function getPlurial() {
	const total = await getTotalVehicles();
	if(total <= 0) {
		return 'none';
	}
	if(total <= 10) {
		return 'few';
	}
	return 'many';
}
