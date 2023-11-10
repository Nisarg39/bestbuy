"use client"
import { scrapeAndStoreProduct } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import React, { FormEvent, use, useState } from 'react'


const Searchbar = () => {
    const [searchPrompt, setsetsearchPrompt] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const isValidAmazonProductURL = (url: string) => {
       
        try {
            const parsedURL = new URL(url);
            const hostname = parsedURL.hostname;    

            if(
                hostname.includes('amazon.com') ||
                hostname.includes('amazon.') ||
                hostname.includes('amazon') 
            ){
                return true;
            }
        } catch (error) {
            return false;
        }
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const isValidlink = isValidAmazonProductURL(searchPrompt);

        // alert(isValidlink ? 'Valid Link ' : 'Invalid Link')


        if(!isValidlink) return alert('please provide a valid amazon link')


        try {
            setIsLoading(true)

            // scraping the product
            const product = await scrapeAndStoreProduct(searchPrompt)

            // redirecting to product page using product id passed using router.replace 
            router.replace(`/products/${product}`)

        } catch (error) {
            console.log(error)
        }finally{
            setIsLoading(false)
        }

    }

  return (
    <form  className='flex flex-wrap gap-4 mt-12'
        onSubmit={handleSubmit}
    >
        <input 
        type="text"
        value={searchPrompt}
        onChange={(e) => setsetsearchPrompt(e.target.value)}
        placeholder='Enter product link'
        className='searchbar-input' />

        <button type='submit' className='searchbar-btn'
            disabled={searchPrompt === ''}
        >
            {isLoading ? 'Searching...' : 'Search'}
        </button>
    </form>
  )
}

export default Searchbar