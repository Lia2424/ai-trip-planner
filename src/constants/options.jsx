export const SelectTravelersList=[
    {
        id:1,
        title:'Just Me',
        desc:'A solo adventure',
        icon:'user',
        people:'1'
    },
    {
        id:2,
        title:'Duo Trip',
        desc:'Two peas in a pod',
        icon:'users',
        people:'2'
    },
    {
        id:3,
        title:'Small group',
        desc:'Small but mighty group',
        icon:'users-round',
        people:'3 to 5 people'
    },
    {
        id:4,
        title:'Large group',
        desc:'The more the merrier',
        icon:'users-round',
        people:'5 to 10 people'
    }
]

export const SelectBudgetOptions=[
    {
        id:1,
        title:'Affordable',
        desc:'A trip on a budget',
        icon:'💵'
    },
    {
        id:2,
        title:'Moderate',
        desc:'Keeping the cost on the average side',
        icon:'💰'
    },
    {
        id:3,
        title:'Luxury',
        desc:'A trip of a lifetime',
        icon:'💸'
    },
]

export const AI_PROMPT='Generate Travel Plan for the city of {location} for {totalDays} days for {traveler} travelers with a {budget} budget. All prices must be in USD (US dollars) format like $50-$70 or $100 per person. Use $ symbol for all hotel prices and ticket pricing.'