import 'tailwindcss/tailwind.css'
import ai from "../assets/ai.svg"
import Image from 'next/image';

export default function AI(): JSX.Element {

  return (
    <>
      <div className='py-32' id='about'>  
 {/**bg-gray-50 */}
        <div className="container m-auto px-6 text-[#FAFAFA] md:px-12 xl:px-6">
            <div className="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
                <div className="md:5/12 lg:w-5/12 ml-0 lg:ml-auto">
                  <Image src={ai} alt="image" loading="lazy" />
                </div>
                <div className="md:7/12 lg:w-6/12">
                  <div className='text-sm font-bold ml-0.5 mb-2 tracking-widest text-noto-purple'>JOB HUNTING MADE EASY</div>
                  <h2 className="lg:text-5xl text-3xl font-bold text-[#FAFAFA]">Get <span className='bg-gradient-to-r from-teal-300 via-blue-500 to-noto-purple bg-clip-text text-transparent'>AI-Powered</span> Job Recommendations</h2>
                 
                  <p className="mt-4 ">Discover tailored job opportunities with our AI algorithms analyzing your portfolio, helping you find relevant roles that align with your skills and goals.</p>
                
                </div>
               
            </div>
        </div>

      </div>
    </>
  );
}