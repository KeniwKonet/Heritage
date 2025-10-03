import type React from "react"

const ChairmanPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="bg-white text-gray-800 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-8 text-amber-600 hover:text-amber-800 transition-colors duration-300 font-semibold"
        >
          &larr; Back to Home
        </button>
        <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4 font-display">
          MEET OUR CHAIRMAN HISTORIAN OYEJIDE OLATUNJI THE COLOSSUS OF AFRICAN ARTS
        </h1>
        <div className="prose prose-lg max-w-none">
          <p>
            Historian Oyejide Olatunji popularly known as Oloke,He hailed from Okeigbo,Ondo State the home town of D.O
            Fagunwa the pioneer Yoruba literature the writer of Ogboju Ode ninu Igbo irunmole.
          </p>

          <h2 className="text-2xl font-bold text-amber-900 mt-8 mb-4">EDUCATION AND CAREER</h2>
          <p>
            He started his early education from saint Gabriel primary school, okeigbo later went to Okeigbo Grammar
            school,He finished his secondary school in 1994 and relocated to Lagos State
          </p>
          <p>He went to Lagos State polytechnic to study business sudied</p>
          <p>He also went to Obafemi Awolowo University to study History and International relations.</p>

          <p>He has worked with different organizations,</p>
          <p>He worked with Mutual benefits assurance as a Marketer</p>
          <p>
            Presently working with Portal realties Ltd, as a Marketer before he later promoted to the post of branch
            manager, PortHarcourt.
          </p>

          <p>He is current PRO of Okeigbo Valued friends</p>
          <p>He is the CEO of Omo Oduduwa Global Heritage Ltd</p>
          <p>He is an associate member of amnesty international (USA)</p>

          <p>
            In 2012 he organized D.O Fagunwa memorial lecture in rememberance of D.O.Fagunwa in his hometown,the late
            Professor Sola Olowu was the Speaker of the Day and Mr Tayo Oyetibo SAN was the chairman of the event.
          </p>

          <p>He was also a member of Okeigbo day committees in 2019</p>

          <p>
            Historian Oyejide Olatunji is committed and devoted to showcasing and promoting Nigerian art and culture
            most especially Yoruba culture to the world.
          </p>

          <p>
            His interest in art and culture dates back to his days as an undergraduate in the Obafemi Awolowo
            university as he revealed that his life depends on culture, he said: "It goes from interest to passion and
            passion to obsession.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ChairmanPage