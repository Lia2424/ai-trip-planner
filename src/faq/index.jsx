import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function FAQ() {
  return (
    <section id="faq" className="py-12 md:py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center space-y-4 mb-16">
          <h1 className="font-heading text-3xl md:text-4xl font-bold">
            A little help along the way.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our AI Travel Planner
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" className="space-y-2" collapsible>
            <AccordionItem value="item-2" className="travel-card px-5">
              <AccordionTrigger className="text-left font-semibold text-foreground py-4 hover:no-underline">
                Do I need to create an account to use the travel planner?
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 pt-2 pb-6">
                No, you don't need to sign in with Google to create your travel plans. However, signing in allows you to access your trips anytime, share them with others, and manage multiple itineraries. Your account is free and secure, using Google's authentication system.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="travel-card px-5">
              <AccordionTrigger className="text-left font-semibold text-foreground py-4 hover:no-underline">
                Can I share my travel itinerary with others?
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 pt-2 pb-6">
                Absolutely! Each travel plan you create gets a unique shareable link. You can share your itinerary via email, WhatsApp, Telegram, Facebook, or simply copy the link. This makes it easy to share your travel plans with friends, family, or travel companions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="travel-card px-5">
              <AccordionTrigger className="text-left font-semibold text-foreground py-4 hover:no-underline">
                Is there a limit to how many trips I can create?
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 pt-2 pb-6">
                No, there's no limit! You can create as many travel plans as you want. All your trips are saved in your account under "My Trips" where you can easily access, view, and manage them anytime.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="travel-card px-5">
              <AccordionTrigger className="text-left font-semibold text-foreground py-4 hover:no-underline">
                Can I modify or edit a travel plan after it's created?
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 pt-2 pb-6">
                Currently, each travel plan is generated as a complete itinerary. If you'd like changes, you can create a new trip with updated preferences. We're continuously improving our platform and plan to add editing features in the future.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="travel-card px-5">
              <AccordionTrigger className="text-left font-semibold text-foreground py-4 hover:no-underline">
                What destinations are supported?
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 pt-2 pb-6">
                Our travel planner supports destinations worldwide.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10" className="travel-card px-5">
              <AccordionTrigger className="text-left font-semibold text-foreground py-4 hover:no-underline">
                Is the service free to use?
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 pt-2 pb-6">
                Yes! Our AI Travel Planner is completely free to use. You can create unlimited travel plans, save them to your account, and share them with others - all at no cost.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  )
}

export default FAQ

