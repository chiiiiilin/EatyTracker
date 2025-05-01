<template>
	<div class="flex flex-col bg-base-100 h-[calc(100vh-88px)]" >
		<h1 class="text-center text-lg font-bold py-4">AI 營養師</h1>
		<div class="flex-1 flex flex-col justify-end px-3 py-3 overflow-auto">
			<div class="space-y-3">
				<div class="chat chat-start">
					<div class="chat-image avatar">
						<div class="w-10 rounded-full">
							<img
								alt="AI avatar"
								src="/public/icon-192x192.png"
							/>
						</div>
					</div>
					<div class="chat-bubble">
						這個功能正在悄悄準備中～請耐心等候唷！💪🍓<br />
						Hold on tight! This feature is cooking up behind the
						scenes! 🧁✨
					</div>
				</div>
				<div class="chat chat-start">
					<div class="chat-image avatar">
						<div class="w-10 rounded-full">
							<img
								alt="AI avatar"
								src="/public/icon-192x192.png"
							/>
						</div>
					</div>
					<div class="chat-bubble">
						我知道你迫不及待，但還差一點點點點點～🐣<br />
						I know you're excited, just a teeny tiny bit more time~
						⏳🎀
					</div>
				</div>
				<div class="chat chat-start">
					<div class="chat-image avatar">
						<div class="w-10 rounded-full">
							<img
								alt="AI avatar"
								src="/public/icon-192x192.png"
							/>
						</div>
					</div>
					<div class="chat-bubble">
						馬上就好啦～請先喝杯水放鬆一下🌈🧋<br />
						Almost there! Go grab a drink and chill for a bit 🌟🥤
					</div>
				</div>
			</div>
		</div>

		<!-- 最底輸入欄位 -->
		<div class="px-3 py-4 border-t border-base-300">
			<input
				type="text"
				placeholder="輸入你的訊息... (目前尚未開放)"
				class="input input-bordered w-full"
				disabled
			/>
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
