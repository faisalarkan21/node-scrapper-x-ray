/*
* @Author: d4r
* @Date:   2018-02-11 22:26:41
* @Last Modified by:   d4r
* @Last Modified time: 2018-02-11 23:55:46
*/

'use strict'

const debug = require('debug')('ibadf')
const fs = require('fs')
var htmlToText = require('html-to-text')
const url = 'https://www.bookdepository.com/publishers/Open-Book-Publishers'
const deepurl = 'https://badmintonindonesia.org/app/information/newsDetail.aspx?/6924'
const mockurl = 'https://google.com'

const Xray = require('x-ray');
const options = {}
options['filters'] = {
	defaultEdition:	function () {
		return 1
	}
}
const x = Xray(options);

debug('start scraping')
x(
	url, 
	'div.tab > div.book-item',
	{
		content: x(
			'div.book-item',[{
				Judul_Buku: 'div.item-img > a > img@alt',
				Pengarang: 'p.author > a',
				ISBN: 'a.add-to-basket@data-isbn',
				Tanggal_Terbit: 'p.published',
				Edisi: ' | defaultEdition',
				Harga: 'div.item-actions > div.btn-wrap > a@data-price',
				image: 'div.item-img > a > img@src',
				Jumlah_Halaman: x('div.item-img > a@href', 'div.item-wrap > div.biblio-wrap > div.biblio-info-wrap > ul.biblio-info > li > span > span')
				// image: x('#gbar a@href', 'title'), // follow link to google images
			}]
		)
	}	
).paginate('li.next a@href').limit(10)(function(err, obj) {
	// debug('result : ', obj)
	console.log(obj)
	const text = JSON.stringify(obj, null, 4)
	fs.writeFile('results.json', text, 'utf8', (err) => {
	  if (err) throw err;
	  console.log('The file has been saved!');
	});
})