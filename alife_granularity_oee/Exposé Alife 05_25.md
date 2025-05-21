## Intro:

Evolution. Isn’t it one of the most fascinating mecanism of nature ? I mean, it is a mecanism which, when we think about it, transforms pure randomness, or sometime chaos, into something which has information or can achieve tasks.   
During the process of evolution, we have creativity at play to make an entity that fits the best its environment.   
But most importantly, evolution can be directed or unbounded \! And to me this is the core fascinating aspect of evolution. One can setup a simulation of evolution of any sort, and decides whether he wants something precise from it or simply setup a simulation which will go on forever, display systems that will adapt to their local environment.

## Definitions – This is the moment where you pay attention so that you can sleep but still follow the talk when you wake up

Even evolution is hard to define (expliquer que le définition standard ne s’applique pas à tous nos cas de figure)  
But mostly, it will consists on a never ending cycle of: birth with variation \+ reproduction \+ death  

[![][image1]](https://en.wikipedia.org/wiki/Evolution)

Simulation \= Alife model. Here we bound only to software simulations trying to have life in simulo, not reproduction of behaviors foundable in nature.  
Component \= an entity in the simulation. Can be a genetic sequence, a blob, a program, a particle, multi particles, anything.   
Fitness \= reproductive success score. It is one of the main focus of my attention in this little talk. Little warning: when I talk about a component, it does not necessarily have a fitness score. For example we will talk about particle life, the particles them self don’t have a fitness score whatsoever, as they cannot reproduce. But the way they interact with each other may form a “creature” that have a fitness score, and the particles are the parts of this creature so they are linked with this fitness score.

Lastly, open ended evolution and why is it interesting. I think most of you know what open ended evolution is about but let s put ourselves on the same page, and I hope I will not frustrate anyone with my definition. In most cases, OEE is achieved when a evolutive system presents endless novelty and creativity in the creatures they produce. The greatest example of OEE that we have is life itself, there is no “ultimate life form” that is the final product of evolution on earth. Except maybe for crabs, but this is a story for another time.    
OEE is a very open subject that we don’t understand fully in the depth but roughly we have identified 3 main characteristics of OEE:

- increasing diversity  
- progressive complexification of the evolving creatures along the history, but this does not mean that simpler entities are abandoned along the way  
- major breakthroughs and transitions (replicating molecules, genetic code for replication, multicellularity & cell differentiation, language & societies, abstract intelligence)

## My proposition – Last time I require your attention

We can group the Alife models into 3 subgroups that are characterised by how the components of a system are related to their fitness function or a fitness function. This is interesting because:  
If we better understand the stakes of a simulation, we can narrow what we will study in this simulation, for example if we know that open ended evolution is very unlikely in this model, studying something simpler like the conditions for emergence might more interesting

Disclaimer: I don’t contribute in any way to the field but I propose you a journey through some artificial life models that captivated me in a way or another, and the journey will be guided with this perhaps novel point of view of judging the models by looking at their 

### Very complex component, explicit fitness function – Now you can sleep

Where the genotype itself defines directly the fitness.   
Examples:

- Genetic algorithms globally englobes all of those, therefore they are the least **open ended**.   
  - Flappy IA  [`js`]
  - Accrobats  [`js`]
  - Beautiful things: Movements in water [YouTube](https://youtu.be/gVEWaOtEASM?t=556)   
- Useful things: ST5 Nasa used gen algo to find the best shape of an antenna [Wikipedia link](https://en.wikipedia.org/wiki/Evolved_antenna) 

[![][image2]](https://en.wikipedia.org/wiki/Evolved_antenna)  
By design, the open endness of evolution is impossible here. With an explicit fitness, we miss three points of open ended evolution: 

1. the search space of DNA is often very limited  
2. diversity is not increasing at all and is narrowed towards an objective  
3. it is very hard to have major breakthrough once a local minima is achieved

But this does not mean it is not interesting to study them in the light of OEE. This is the perfect example of what not to achieve. One of the challenge of OEE is to have a statistical metric to measure it. So we can use those

### Moderately complex components, Guessable fitness function

Where each component is complex enough to behave and achieve tasks, like accumulating energy, moving, reproducing, etc.   
**Module based** simulations mostly compose this class. This class of simulations defines a set of components that can be used by a creature in the simulation. Its genetic code is the set of components used and how they are placed.  
Examples:

- Life engine [YouTube link](https://www.youtube.com/watch?v=OOCFgYzxxvs&list=PL_UEf8P1IjTjt1xaENujdnq-wPd6kFFGh&index=6) 

- Tierra [YouTube link](https://www.youtube.com/watch?v=Wl5rRGVD0QI)   
- Bibites [YouTube link](https://www.youtube.com/watch?v=KQN7EToy9X0) 

In this case, open endness of evolution is often dependant of two main parameters of the simulation:

- How easy is it for creatures to reproduce ? Because if it is very hard, the space of viable creatures can be very narrow and thus evolution would always converge to the same set of solutions, which is not very desirable for open ended evolution  
- The variety of modules and the possibilities allowed by their combinations. Even if the space of possibilities is enormous, the most complex systems should still be possible to live, otherwise the evolution will easily hit a glass ceiling and not produce new creatures.

Let s look at an amazing Alife world that still falls into the 2nd category and achieve an amazing degree of open endedness:

- ALIEN [https://alien-project.org/](https://alien-project.org/) 

ALIEN presents something very crucial for open ended evolutions in my opinion so we will stop here and talk a bit more about it.  
As I said earlier, the way ALIEN is built is that there are two layers of simulation: the bottom layer simulates the physics of the simulation so the particles, how they interact and so on, while the top layer is a information processing and action processing that influences the bottom layer.

This separation of the physical and the information layer makes a direct echo to one of the most important paper regarding evolution in biology: “The Major Transitions in Evolution” by Smith and Szathmary. This paper highlighted among many other things, that over the course of time, the information has a tendency to be decoupled from an organism physical structure. DNA is a great example: all information about the organism is encoded in one long chain of molecules that is separated from the rest of the parts of the organisms that performs actions.  
   
I haven’t read a lot about this formalization and I give the all the credit to Clément for introducing me to it. So either I haven’t crossed the right papers, or there is a gap in the literature.

So, to make a proper formalization: I believe that in artificial life models, they are 2 **important layers**: 

- The matter layer, or mass layer: which defines how is the physics is defined, how does it interact with itself, what is its dynamic, etc  
- The information layer. Where things can be computed, where information about the world can be processed

In real life the matter layer is very obvious to out eyes, but I wonder if we don’t have 2 information layers istead of 1: 

1. The genetic codes to make the organism it self, to organize the matter to form a living creature.  
2. The electrical signals that allows reactions, thinking, censoring and processing.

Now, the link with open endness evolution \!   
Well, actually it is not trivial at all. From what we understand from life, the best we can conclude is that: it is important for open endedness that the two layers co-exist and interact between them, in a sort of feedback loop. This allows to drastically increase the possibilities of actions and mechanisms to arise in an artificial life model. Also, I believe that it allows emergence of intelligence at a lower cost, since the structure for it is already there is no need of discovering it. So, it is a way for a model to accelerate things up. If you have some inputs to put here, I’d be glad to hear them.

### Simplest components, Invisible fitness

When the genotype is not encoded, but formed with the rules of the simulations. The components are often simply achieving some predetermined reactions, and creatures that are able to self reproduce or modify them self are created from the agencement of these reactions and the combinations of them.  
In these simulations it is often even hard to get something to evolve at all because to get the right reactions to happen requires an amount of randomness that make the simulation not very suitable to observe open ended evolution. But in the other hand, the fact that everything could be possible suggests that evolution could happen in forms which we would not be able to anticipate, which is very exciting \! 

Examples:

- Emergence particle simulation from ThomasCabaret [YouTube link](https://www.youtube.com/watch?v=JmCN_4jTwf8).   
  - This is an example where very simple rules can lead to something already evolving  
- Tom Mohr’s Particle life [YouTube link](https://www.youtube.com/watch?v=p4YirERTVF0&t=130) Long Experiment: [YouTube link](https://youtu.be/kx2ndqK8rxo?si=KwQAgLEWViNN8blY&t=535)   
  - No trivial intelligence layer  
- Gol in a certain way. But in my opinion it is much more difficult to get evolution from it. Since turing completeness: anything should possible and attainable in it [`js`]
- Lenia: explication rapide  [`js`]
  - flow lenia: explication  
  - Comment ils ont utilisé flow lenia pour faire evoluer des créatures [YouTube link](https://www.youtube.com/watch?v=bAJIETmC-6o)   
- Life itself, of course [lien youtube à trouver]

# Sources

[https://arxiv.org/pdf/1909.04430](https://arxiv.org/pdf/1909.04430)  
[https://publications.aston.ac.uk/id/eprint/44173/1/artl\_a\_00210.pdf](https://publications.aston.ac.uk/id/eprint/44173/1/artl_a_00210.pdf)   
[https://arxiv.org/pdf/1909.04430](https://arxiv.org/pdf/1909.04430)  
[https://link.springer.com/article/10.1007/s12064-016-0229-7](https://link.springer.com/article/10.1007/s12064-016-0229-7) 

Major transitions in Evolution: [https://books.google.ch/books?hl=en\&lr=\&id=wP9QEAAAQBAJ\&oi=fnd\&pg=PP1\&dq=The+Major+Transitions+in+Evolution\&ots=ThJPRftVlG\&sig=74C-N11O3BEVeyNqytkQVP7jDzA\&redir\_esc=y\#v=onepage\&q=The%20Major%20Transitions%20in%20Evolution\&f=false](https://books.google.ch/books?hl=en&lr=&id=wP9QEAAAQBAJ&oi=fnd&pg=PP1&dq=The+Major+Transitions+in+Evolution&ots=ThJPRftVlG&sig=74C-N11O3BEVeyNqytkQVP7jDzA&redir_esc=y#v=onepage&q=The%20Major%20Transitions%20in%20Evolution&f=false) 

[image1]: https://en.wikipedia.org/wiki/Evolution#/media/File:Mutation_and_selection_diagram.svg
[image2]: https://en.wikipedia.org/wiki/Evolved_antenna#/media/File:St_5-xband-antenna.jpg
