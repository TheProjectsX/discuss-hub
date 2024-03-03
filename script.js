// Elements
const searchForm = document.getElementById("searchForm");
const searchQuery = document.getElementById("searchQuery");

const forumDataLoader = document.getElementById("forumDataLoader");
const forumDataSection = document.getElementById("forumDataSection");
const forumPostsContainer = document.getElementById("forumPostsContainer");
const readPostContainer = document.getElementById("readPostContainer");
const readPostCount = document.getElementById("readCount");

const latestDataLoader = document.getElementById("latestDataLoader");
const latestPostsContainer = document.getElementById("latestPostsContainer");

// Global Variables
let currentForumPosts = [];

// Add to Read
const addToRead = (postId) => {
  const post = currentForumPosts.find((post) => post["id"] == postId);
  const postElement = `
      <div
      class="p-4 rounded-2xl flex items-center justify-between gap-3 bg-white"
      >
      <h5 class="text-lg font-extrabold ml-3">
          ${post["title"]}
      </h5>
      <p class="flex gap-2 mr-3">
          <img
          src="assets/icons/views.svg"
          alt="Time Icon"
          class="w-5"
          />
          ${post["view_count"]}
      </p>
      </div>
      `;

  readPostContainer.innerHTML = readPostContainer.innerHTML + postElement;
  readPostCount.innerText = parseInt(readPostCount.innerText) + 1;
};

// Load Forum Posts
const loadForum = async (tag) => {
  const loaderStartTime = Date.now();

  forumDataLoader.style.display = "flex";
  forumDataSection.style.display = "none";

  let url;
  if (tag === undefined) {
    url = "https://openapi.programming-hero.com/api/retro-forum/posts";
  } else {
    url = `https://openapi.programming-hero.com/api/retro-forum/posts?category=${tag}`;
  }

  let data;
  try {
    const res = await fetch(url);
    data = await res.json();
    currentForumPosts = data["posts"];
  } catch (error) {
    console.log(error);
  }

  forumPostsContainer.innerHTML = "";
  currentForumPosts.forEach((item) => {
    const postElement = `
    <div
        class="p-6 rounded-lg bg-[#F3F3F5] border border-[#F3F3F5] flex gap-5 hover:border-[#797DFC] hover:bg-[#797DFC1A] font-inter cursor-pointer forumPost"
    >
        <div class="relative">
        <img
            src="${item["image"]}"
            alt="Post Image"
            class="max-w-20 rounded-lg"
        />
        <!-- Active Status -->
        <!-- Unactive: #FF3434 -->
        <div
            class="w-3 h-3 rounded-full absolute -right-1 -top-1 border border-[white]"
            style="background-color: ${
              item["isActive"] ? "#10B981" : "#FF3434"
            }"
        ></div>
        </div>
        <div>
        <div class="flex gap-4 font-bold text-sm mb-2">
            <p># ${item["category"]}</p>
            <p>Author: ${item["author"]?.name ?? "Unknown"}</p>
        </div>
        <h5 class="text-xl font-extrabold mb-2 font-mulish">
            ${item["title"]}
        </h5>
        <p
            class="text-[#12132D99] mb-5 pb-5 border-b border-dashed border-[#12132D40]"
        >
            ${item["description"]}
        </p>
        <div class="flex justify-between gap-5 items-center">
            <div class="flex gap-4 *:flex *:gap-2 text-[#12132D99]">
            <p>
                <img
                src="assets/icons/comments.svg"
                alt="Comments Icon"
                class="w-5"
                />
                ${item["comment_count"]}
            </p>
            <p>
                <img
                src="assets/icons/views.svg"
                alt="Views Icon"
                class="w-5"
                />
                ${item["view_count"]}
            </p>
            <p>
                <img
                src="assets/icons/time.svg"
                alt="Time Icon"
                class="w-5"
                />
                ${item["posted_time"]} min
            </p>
            </div>

            <button onclick="addToRead(${item["id"]})">
            <img src="assets/icons/message.svg" alt="Message Icon" />
            </button>
        </div>
        </div>
    </div>
            `;
    forumPostsContainer.innerHTML = forumPostsContainer.innerHTML + postElement;
  });

  if (currentForumPosts.length === 0) {
    const pTag = document.createElement("p");
    pTag.innerText = "No Post Found!";
    pTag.style.width = "max-content";
    pTag.style.padding = "12px 40px";
    pTag.style.fontSize = "40px";

    forumPostsContainer.innerText = "";
    forumPostsContainer.appendChild(pTag);
  }

  const timeLeft = Date.now() - loaderStartTime;
  if (timeLeft <= 2000) {
    setTimeout(() => {
      forumDataLoader.style.display = "none";
      forumDataSection.style.display = "flex";
    }, 2000 - timeLeft);
  } else {
    forumDataLoader.style.display = "none";
    forumDataSection.style.display = "flex";
  }
};

// Load Forum Posts
const loadLatest = async () => {
  let url = "https://openapi.programming-hero.com/api/retro-forum/latest-posts";

  try {
    const res = await fetch(url);
    const data = await res.json();
    latestPostsContainer.innerHTML = "";

    data.forEach((item) => {
      const postElement = `
        <div class="max-w-80 p-6 rounded-2xl border border-[#12132D26]">
        <img
          src="${item["cover_image"]}"
          alt="Post Banner"
          class="w-full rounded-2xl mb-5"
        />
    
        <p class="flex gap-1.5 items-center text-[#12132D99] mb-6">
          <img src="assets/icons/date.svg" alt="Date Icon" class="w-6" />
          ${item["author"]?.posted_date ?? "No Publish Date"}
        </p>
        <h5 class="text-xl font-extrabold mb-4">
        ${item["title"]}
        </h5>
        <p class="text-[#12132D99] mb-4 font-inter min-h-[96px]">
        ${item["description"]}
        </p>
        <div class="flex gap-5 items-center">
          <img
            src="${item["profile_image"]}"
            alt="Profile Picture"
            class="w-14 h-14 rounded-full"
          />
          <div>
            <p class="font-extrabold text-xl mb-1">${item["author"]["name"]}</p>
            <p class="text-[#12132D99]">${
              item["author"]["designation"] ?? "Unknown"
            }</p>
          </div>
        </div>
      </div>`;

      latestPostsContainer.innerHTML =
        latestPostsContainer.innerHTML + postElement;
    });
  } catch (error) {
    console.log(error);
  }
  latestDataLoader.style.display = "none";
  latestPostsContainer.style.display = "flex";
};

// Search by Query
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const query = searchQuery.value;
  loadForum(query);
});

// Load Forum Posts
loadForum();
loadLatest();
