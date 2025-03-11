import React from "react";
import './Recipe.css';

const Recipe = () => {
    return(
        <>
        <section id="recipe">
            <div class="container">
                <h2>Tuna Salad</h2>
                <p>Može li se napraviti da se kod namirnica vidi ako je koja od namirnica u košarici i koliko je količinski ima te ako je u kojem drugom receptu koji je spremljen za raditi s tim namirnicama da se vidi koliko ga je ostalo (tip ako ima 1kg brašna u košraeici i u drugom receptu smo upotrijebili 500g, a ovdje treba dodati 600g brašna da se vidi to sve i da može kupac odlučiti ako želi dodati još 1 kg brašna ili ne. Možda da se stavi to kao opcija koja se može uključiti i isključiti.</p>
                <div class="row">
                    <div class="col-md-8">
                        <img src="https://placehold.co/600x400" alt="" title="" />
                        <div class="row">
                        <div class="r-border col-4">
                            <p>Prep time:</p>
                            <p>5 mins</p>
                        </div>
                        <div class="r-border col-4">
                            <p>Cook time:</p>
                            <p>5 mins</p>
                        </div>
                        <div class="col-4">
                            <p>Persons:</p>
                            <p>5 per</p>
                        </div>
                        </div>
                        <p>This recipe features a vibrant and refreshing salad made with a medley of mixed greens, accompanied by a flavorful sun-dried tomato dressing. </p>
                        <div>
                        <h5>Ingridients:</h5>
                        <ul>
                            <li><input type="checkbox" />1/4 cup Sun-dried tomatoes<button class="btn p-0">Add to cart</button></li>
                            <li><input type="checkbox" />2 tbsp Soymilk<button class="btn p-0">Add to cart</button></li>
                            <li><input type="checkbox" />5/8 tsp Rosemary<button class="btn p-0">Add to cart</button></li>
                            <li><input type="checkbox" />3/4 tsp Thyme<button class="btn p-0">Add to cart</button></li>
                            <li><input type="checkbox" />1/4 medium whole Tomatoes<button class="btn p-0">Add to cart</button></li>
                            <li><input type="checkbox" />1/4 fruit without seeds Lemons<button class="btn p-0">Add to cart</button></li>
                            <li><input type="checkbox" />Salt<button class="btn p-0">Add to cart</button></li>
                            <li><input type="checkbox" />Salt<button class="btn p-0">Add to cart</button></li>
                        </ul>
                        </div>
                        <div>
                        <h5>Instructions:</h5>
                        <ol>
                            <li>Soak the sun-dried tomatoes in the soy milk for an hour.</li>
                            <li>Chop the fresh herbs, tomato, and onions and toss them with the salad greens. Add additional veggies as desired</li>
                            <li>Juice the lemon and combine in a high-powered blender with the sun dried tomato mixture and garlic until smooth. Pour over salad and toss together well. Top with brazil nuts and enjoy!</li>
                            <li>Chop the fresh herbs, tomato, and onions and toss them with the salad greens. Add additional veggies as desired</li>
                            <li>Juice the lemon and combine in a high-powered blender with the sun dried tomato mixture and garlic until smooth. Pour over salad and toss together well. Top with brazil nuts and enjoy!</li>
                        </ol>  
                        </div>
                    <div>
                    <h5>Instructions:</h5>
                    <ol>
                        <li>Ensure the freshness of your mixed greens. Look for crisp, vibrant leaves with no signs of wilting or browning.</li>
                        <li>Ensure the freshness of your mixed greens. Look for crisp, vibrant leaves with no signs of wilting or browning.</li>
                    </ol>  
                    </div>    
                </div>    
                    <div class="col-md-4">
                    
                    </div>
                </div>
            </div>    
        </section>
        </>
    );
};

export default Recipe;        