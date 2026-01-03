import { fontCursive, fontSans } from "@/config/fonts";
import { HeartFilledIcon } from "@/components/icons";

export default function OurStorySection() {
  return (
    <section className="px-4 py-16 md:py-24 max-w-4xl mx-auto">
      <div className="flex flex-col items-center mb-10">
        <HeartFilledIcon className="text-wedding-pink-500 w-8 h-8 mb-4 animate-pulse" />
        <h2
          className={`${fontCursive.className} text-5xl md:text-6xl text-center bg-gradient-to-r from-wedding-pink-600 to-wedding-gold-600 bg-clip-text text-transparent py-4 leading-normal`}
        >
          Our Love Story
        </h2>
      </div>

      <div
        className={`${fontSans.className} text-lg md:text-xl leading-relaxed space-y-8 text-gray-800 dark:text-gray-100 text-justify md:text-left`}
      >
        <p>
          It all began on a regular summer day in college—nothing extraordinary,
          just the usual buzz of campus life. I had seen her before, maybe more
          than once, and felt a faint curiosity about her. We weren&apos;t in
          the same class at first. But looking back, I must have felt something,
          even if I didn&apos;t realize it then.
        </p>

        <p>
          She later told me she noticed me before too—when I was helping a
          professor with the wall magazine. I was wearing a white shirt and
          cargo pants, a bit out of fashion, but that was my look back then:
          curly hair, nerdy glasses. She says I didn&apos;t strike her as
          particularly attractive at first, but I was known among the girls, so
          I must&apos;ve caught her attention eventually.
        </p>

        <p className="font-semibold text-wedding-pink-600 dark:text-wedding-pink-400 italic text-center text-xl md:text-2xl my-8">
          &quot;Fate, as always, had other plans.&quot;
        </p>

        <p>
          Soon she was in our class in the second year. I&apos;ll admit—I had a
          bit of interest in her, but it wasn&apos;t love or even a crush.
          Just... curiosity. At that time, both of us were going through what
          you could call “leftover heartbreaks” and the general messiness of
          life.
        </p>

        <p>
          The real turning point came during our college excursion to Lataguri.
        </p>

        <p>
          It feels magical now in retrospect, like a story written by chance,
          but back then, we were simply going with the flow. The boys&apos; and
          girls&apos; stays were in separate areas. That night, our room was
          alive with music, dance, gossip—and yes, a little alcohol, even though
          it was against the excursion rules. We were young, wild, and free.
          Around 9:00 p.m., the room was thick with cigarette smoke, and the
          floor was slick with sweat from all the dancing.
        </p>

        <p>Then came a knock at the door. We all froze.</p>

        <p>
          She had been sitting on the bed with the other girls, gossiping.
          Startled, she tried to rush to the bathroom and slipped—on my sweat,
          of all things. Her ankle was swollen and, as we found out later,
          broken. It was our sir at the door. Somehow, we managed to calm the
          situation.
        </p>

        <p>
          But that night became unforgettable—not just because of her injury,
          but because of everything that followed.
        </p>

        <p>
          I carried her to the girls&apos; quarters. Later that night, I was
          called back because the girls suspected a hidden camera in the
          bathroom. I had to climb an outside wall to inspect it—turned out to
          be just a pipe outlet. A junior got terrified by a spider, and then
          the drunk travel agent began telling me ghostly elephant tales at 2
          a.m. It was chaos, laughter, and a touch of madness.
        </p>

        <p>
          Next, we headed to Kolakham—with her injured foot and me beside her.
          And that&apos;s where something shifted between us. Something clicked.
          It felt... right.
        </p>

        <p>
          On the last night, all of us were huddled together in a single room.
          Under the shared warmth of a blanket, our hands found each other. We
          didn&apos;t plan it, we didn&apos;t talk about it. It just happened.
          That room—its energy, that feeling—is still etched vividly in our
          minds.
        </p>

        <p>
          Back in the city, I began dropping her off at college on my scooter.
          Still, we didn&apos;t label it love. It felt like love, but we never
          talked about it. She told me later that she once noticed a mark on my
          neck while riding pillion—and felt something stir within her. Things
          began to spiral beautifully out of control. We were falling, slowly
          and deeply.
        </p>

        <p>There were challenges—many—but those are stories for another day.</p>

        <p>Then, one day in the college lift, I kissed her.</p>

        <p>
          That&apos;s when we truly realized: we were in love. We never formally
          proposed to each other; we just were. We tried to mark a date—maybe
          7th January—but even that felt blurry. We weren&apos;t keeping track.
          We were simply living it.
        </p>

        <p>
          College ended, and we chose universities close by so we could still
          meet. She used to wait for me every day at Ballygunge Phari, and from
          there, we&apos;d go home together. Our bond only deepened in
          Kolkata&apos;s chaos and charm.
        </p>

        <p>
          We promised to stay together always. We didn&apos;t have much—but we
          had each other. We studied for government jobs side by side, survived
          lockdowns together, and eventually found the jobs we&apos;re in now.
        </p>

        <p>
          After the lockdown, a new phase began—our shared love for the
          mountains. And I believe that&apos;s when our love truly blossomed.
          From the serene silence of Chandu to the biting cold of Bumla, from
          standing alone on the peak at Rimbik to all the small moments in
          between—we discovered who we really were.
        </p>

        <p>
          Now, we&apos;re about to start writing the next chapter of our lives.
          We don&apos;t know where the road leads. We aren&apos;t rich in
          possessions, but we are rich in love. We&apos;re wanderers, dreamers,
          companions—hand in hand, seeking nothing more than the journey itself.
        </p>

        <p>Because in the end, we may not have everything.</p>

        <p className="font-bold text-2xl mt-8 text-center text-wedding-gold-600 dark:text-wedding-gold-400">
          But we have each other.
        </p>

        <p className={`${fontCursive.className} text-right text-3xl mt-4`}>
          -- Groom
        </p>
      </div>
    </section>
  );
}
