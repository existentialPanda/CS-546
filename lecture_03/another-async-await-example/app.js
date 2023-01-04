import {getApiData} from './getdata.js';

/*Uncomment these lines to demonstrate a top level await
when we do this, then the console.log('After main is run'); is blocked
until the request is done */

// console.log('Top Levl Await');
// console.log(await getApiData());

/* comment out main and the main() function call when trying top level await*/
async function main() {
  //try removing the await keyword and run the application
  try {
    console.log(await getApiData());
  } catch (e) {
    console.log(e);
  }
}

main();

/*	
	this console.log will not be blocked as it does not depend 
	on the results of main so it will execute before 
	main is finished 
*/
console.log('After main is run');
