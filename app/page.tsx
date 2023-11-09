import Image from "next/image"
import Searchbar from "@/components/Searchbar"
import HeroCarousel from "@/components/HeroCarousel"
import { getAllProducts } from "@/lib/actions"
import ProductCard from "@/components/ProductCard"


const Home = async () => {

  const allProducts = await getAllProducts();

  return (
    <>
      <section className='px-6 md:px-20 py-24 border-2'>
        <div className='flex max-xl:flex-col gap-16'>
          <div className='flex flex-col justify-center'>

            <p className='small-text '>
              Want to save some money on expensive products from amazon ?
              {/* <Image 
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
                width={16}
                height={16}
              /> */}
            </p>

            <h1 className="head-text">
              Buy on Lowest Price using 
              <span className="text-[#0ea5e9] "> SmartBuy</span>
            </h1>

            <p className="mt-6">
            Get notified when price drops to its lowest rate using smart analytics feature and don't missout to purchase on right time.
            </p>
              <Searchbar />
          </div>

          <HeroCarousel />

        </div>
      </section>


      <section className="trending-section">
        <h2 className="section-text">Trending</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allProducts?.map((product) => (
            <ProductCard key={product._id} product={product}/>
          ))}

        </div>
      </section>
    </>
  )
}

export default Home