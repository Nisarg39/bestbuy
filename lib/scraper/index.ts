// shah.nisarg49@gmail.com is used to login in bright data and its configs are used here
import axios from 'axios'
import * as cheerio from 'cheerio'
import { extractCurrency, extractDescription, extractPrice } from '../utils';
import { connectToDB } from '../mongoose';

export async function scrapeAmazonProduct(url: string){
    if(!url) return;

    
    //brightdata proxy configuration

    const username = String(process.env.BRIGHT_DATA_USERNAME)
    const password = String(process.env.BRIGHT_DATA_PASSWORD)
    const port = 22225
    const session_id = (1000000 * Math.random()) | 0;

    const options ={
        auth: {
            username: `${username}-session-${session_id}`,
            password,
            host: 'brd.superproxy.io',
            port,
            rejectUnauthorized: false
        }
    }

    try {
        // fecth the product page

        const response = await axios.get(url, options)
        const $ = cheerio.load(response.data)

        // Extract the product title
        const title = $('#productTitle').text().trim();
        // console.log(title)

        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
            $('.a-price.a-text-price')
        );
        
        // console.log(title, currentPrice)

        const originalPrice = extractPrice(
            $('a-size-small aok-offscreen'),
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price')
        )

        // console.log(title, currentPrice, originalPrice)

        const outOfStock = $('availability span').text().trim().toLowerCase() === 'currently unavailable';

        // console.log({title, currentPrice, originalPrice, outOfStock})

        const images = 
            $('#imgBlkFront').attr('data-a-dynamic-image') ||
            $('#landingImage').attr('data-a-dynamic-image')||
            '{}'
        
        const imageUrls = Object.keys(JSON.parse(images));

        // console.log({title, currentPrice, originalPrice, outOfStock, imageUrls})

        const currency = extractCurrency($('.a-price-symbol'))
        
        // console.log({title, currentPrice, originalPrice, outOfStock, imageUrls, currency})

        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");

        // console.log({title, currentPrice, originalPrice, outOfStock, imageUrls, currency, discountRate})

        // Construct data object with scraped information
        
        const description = extractDescription($)

        const data = {
            url,
            currency: currency || '$',
            image: imageUrls[0],
            title,
            currentPrice: Number(currentPrice) || Number (originalPrice),
            originalPrice: Number(originalPrice) || Number(currentPrice),
            priceHistory: [],
            discountRate: Number(discountRate),
            category: 'category',
            reviewsCount: 100,
            stars: 4.5,
            isOutOfStock: outOfStock,
            description,
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(originalPrice) || Number(currentPrice),
            averagePrice: Number(currentPrice) || Number(originalPrice),
        }

        // console.log(data)
        return data;
    } catch (error: any) {
        throw new Error(`failed to scrape the product: ${error.message}`)
    }
}

