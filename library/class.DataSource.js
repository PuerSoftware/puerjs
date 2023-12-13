class DataSource {
	static DB_NAME = 'DataSource'
	
	constructor(name, url, adapter) {
		this.name    = name
		this.url     = url
		this.adapter = adapter
	}
}
